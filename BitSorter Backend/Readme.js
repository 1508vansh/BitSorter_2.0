// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios'); // for Judge0 HTTP calls

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// In-memory store (no DB). For production, move to Redis or a DB.
const rooms = {};

/* ---------- Helper functions ---------- */

// Mock / replace with real DB fetch
async function fetchProblemsFromDB(count = 3) {
  // return array of problem meta (id,title,difficulty). DO NOT include hidden tests in client payload.
  // Replace with your Mongo query from BitSorter problems collection.
  return [
    { id: 'p1', title: 'Two Sum', difficulty: 'easy' },
    { id: 'p2', title: 'Reverse String', difficulty: 'easy' },
    { id: 'p3', title: 'Longest Subarray', difficulty: 'medium' }
  ].slice(0, count);
}

// call Judge0 (example). Replace JUDGE0_URL & headers appropriately.
async function runJudge0Submission({ source_code, language_id, stdin = "", expectedOutputHint = "" }) {
  // NOTE: you must adapt to your Judge0 deployment. Many use `POST /submissions?wait=true`.
  // This function should return something like { status: 'Accepted' | 'Wrong Answer' | 'Error', raw: <judge response> }
  const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
  const headers = {
    // example: 'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'Content-Type': 'application/json'
  };
  try {
    const res = await axios.post(JUDGE0_URL, { source_code, language_id, stdin }, { headers });
    // Res structure depends on your Judge0 deployment.
    const status = (res.data && res.data.status && res.data.status.description) || 'Unknown';
    return { accepted: status === 'Accepted', status, raw: res.data };
  } catch (err) {
    console.error('Judge0 error', err?.response?.data || err.message);
    return { accepted: false, status: 'JudgeError', raw: err?.response?.data || err.message };
  }
}

// Compute and return a sorted standings array
function computeStandings(room) {
  const list = Object.values(room.players).map(p => ({
    username: p.username,
    playerId: p.playerId,
    solved: p.solved,
    totalTimeMs: p.totalTimeMs || 0
  }));
  // sort: solved desc, then totalTime asc
  list.sort((a, b) => {
    if (b.solved !== a.solved) return b.solved - a.solved;
    return a.totalTimeMs - b.totalTimeMs;
  });
  return list;
}

/* ---------- Socket.IO event handlers ---------- */

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  // Create room - ack pattern: client passes callback which receives data
  socket.on('createRoom', async (options = {}, ack) => {
    try {
      const roomId = Math.random().toString(36).slice(2, 9); // short shareable id
      const hostPlayerId = uuidv4(); // stable id to hand to client for reconnects
      const problems = await fetchProblemsFromDB(options.problemCount || 3);

      // init room
      rooms[roomId] = {
        roomId,
        hostSocketId: socket.id,
        status: 'waiting',
        startTime: null,
        durationMs: options.durationMs || 10 * 60 * 1000, // default 10 minutes
        problems,
        problemState: {}, // init below
        players: {},
        timer: null,
        tickInterval: null
      };

      // initialize problemState
      for (const p of problems) rooms[roomId].problemState[p.id] = { solvedBy: null, solvedAt: null };

      // join and add host to players
      socket.join(roomId);
      rooms[roomId].players[socket.id] = {
        playerId: hostPlayerId,
        username: options.username || 'Host',
        socketId: socket.id,
        solved: 0,
        totalTimeMs: 0,
        solvedAt: {},
        currentProblemId: null
      };

      // respond to creator with roomId & playerId
      if (typeof ack === 'function') ack({ ok: true, roomId, playerId: hostPlayerId });
      io.to(roomId).emit('updatePlayers', computeStandings(rooms[roomId]));
    } catch (err) {
      console.error('createRoom error', err);
      if (typeof ack === 'function') ack({ ok: false, error: 'create-failed' });
    }
  });

  // Join room
  socket.on('joinRoom', async ({ roomId, username, playerId } = {}, ack) => {
    const room = rooms[roomId];
    if (!room) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Room not found' });
      return;
    }

    // simple capacity check (2 players) - change if you want more
    if (Object.keys(room.players).length >= 2) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Room full' });
      return;
    }

    socket.join(roomId);
    // create a server-side player record keyed by socket.id
    const newPlayerId = playerId || uuidv4();
    room.players[socket.id] = {
      playerId: newPlayerId,
      username: username || 'Guest',
      socketId: socket.id,
      solved: 0,
      totalTimeMs: 0,
      solvedAt: {},
      currentProblemId: null
    };

    io.to(roomId).emit('updatePlayers', computeStandings(room));
    if (typeof ack === 'function') ack({ ok: true, roomId, playerId: newPlayerId, problems: room.problems });

    // Auto-start when two players are present (optional). Alternatively, expose a "start" button.
    if (Object.keys(room.players).length === 2 && room.status === 'waiting') {
      startCompetition(roomId);
    }
  });

  // Accept "start" from host explicitly if you prefer:
  socket.on('requestStart', ({ roomId } = {}) => {
    const room = rooms[roomId];
    if (!room) return;
    // Optionally check that socket.id === room.hostSocketId
    startCompetition(roomId);
  });

  // optional: client notifies which problem they opened
  socket.on('switchProblem', ({ roomId, problemId } = {}) => {
    const room = rooms[roomId];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player) return;
    player.currentProblemId = problemId;
    // broadcast who is looking at which problem (optional)
    io.to(roomId).emit('playerSwitchedProblem', { playerId: player.playerId, username: player.username, problemId });
  });

  // Optional: codeChange for spectating (debounce on client)
  socket.on('codeChange', ({ roomId, problemId, code } = {}) => {
    // Broadcast to others in room (not back to sender)
    socket.to(roomId).emit('codeUpdate', { fromSocketId: socket.id, problemId, code });
  });

  // submitSolution -> server validates via Judge0 and then marks solved
  socket.on('submitSolution', async ({ roomId, problemId, code, languageId } = {}, ack) => {
    const room = rooms[roomId];
    if (!room || room.status !== 'running') {
      if (typeof ack === 'function') ack({ ok: false, error: 'Room not running' });
      return;
    }
    const player = room.players[socket.id];
    if (!player) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Not in room' });
      return;
    }

    // Run Judge0 (server-side). Always validate server-side.
    const judgeResult = await runJudge0Submission({ source_code: code, language_id: languageId });
    // send immediate result back to submitter
    if (typeof ack === 'function') ack({ ok: true, judge: judgeResult });

    // If accepted, mark solved (atomic server check)
    if (judgeResult.accepted) {
      const ps = room.problemState[problemId];
      // If not solved yet, mark solvedBy (first-solve)
      if (!ps.solvedBy) {
        ps.solvedBy = player.playerId;
        ps.solvedAt = Date.now();
      }
      // update player's own solved state only if they haven't solved this problem already
      if (!player.solvedAt[problemId]) {
        player.solved += 1;
        const timeSinceStart = Date.now() - room.startTime;
        player.totalTimeMs += timeSinceStart;
        player.solvedAt[problemId] = Date.now();
      }

      // Broadcast updated scoreboard
      io.to(roomId).emit('updateScoreboard', computeStandings(room));

      // If all problems solved by all players combined -> end competition
      const totalSolvedAcrossPlayers = Object.values(room.players).reduce((acc, p) => acc + p.solved, 0);
      if (totalSolvedAcrossPlayers >= room.problems.length) {
        endCompetition(roomId);
      }
    }
  });

  // Disconnect handling (grace period for reconnect)
  socket.on('disconnect', () => {
    // Find room(s) where this socket was present
    for (const roomId of Object.keys(rooms)) {
      const room = rooms[roomId];
      if (!room) continue;
      if (room.players[socket.id]) {
        // leave logically but keep a grace period (e.g., 60s) in case of reconnect
        console.log('player disconnected from room', roomId, socket.id);
        // mark socket as disconnected but keep player data for reconnection mapping
        // Implementation options:
        // 1) Keep player record but remove socket.id mapping (store lastSocketId)
        // 2) Or set a timer and if not reconnected within timeout, remove player and end contest
        // For brevity, we'll immediately remove and end if <2 players left:
        delete room.players[socket.id];
        io.to(roomId).emit('updatePlayers', computeStandings(room));
        // If no players left -> cleanup
        if (Object.keys(room.players).length === 0) {
          clearTimeout(room.timer);
          clearInterval(room.tickInterval);
          delete rooms[roomId];
        } else {
          // optional: if only one player left, you could end contest or keep running
          io.to(roomId).emit('playerLeft', { socketId: socket.id });
        }
      }
    }
  });

  /* ---------- helpers inside connection scope ---------- */

  // startCompetition helper: freezes room->status, sets timers and emits start msg
  async function startCompetition(roomId) {
    const room = rooms[roomId];
    if (!room || room.status === 'running') return;
    room.status = 'running';
    room.startTime = Date.now();

    // broadcast start with problem meta (no hidden tests)
    io.to(roomId).emit('startCompetition', { problems: room.problems, startTime: room.startTime, durationMs: room.durationMs });

    // set a per-room timeout to end contest
    room.timer = setTimeout(() => endCompetition(roomId), room.durationMs);

    // optional: emit countdown every second
    room.tickInterval = setInterval(() => {
      const timeLeft = Math.max(0, room.startTime + room.durationMs - Date.now());
      io.to(roomId).emit('tick', { timeLeftMs: timeLeft });
      if (timeLeft <= 0) clearInterval(room.tickInterval);
    }, 1000);
  }

  // endCompetition helper: compute final standings, emit, clear resources
  function endCompetition(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    room.status = 'finished';
    const standings = computeStandings(room);
    io.to(roomId).emit('endCompetition', { standings, roomId });
    // cleanup
    clearTimeout(room.timer);
    clearInterval(room.tickInterval);
    delete rooms[roomId];
  }
});

server.listen(4000, () => console.log('server running on 4000'));
