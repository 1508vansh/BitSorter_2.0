const { io } = require("../index");
const Problem = require("../models/problem");
const { userSubmission, runCode } = require("../controllers/userSubmission");
const axiosClient = require("../config/axiosClient");
const { v4: uuidv4 } = require("uuid");
const getLanguageId = require("../utils/getLanguageId");

const Submission = require("../models/submission");
const { submitBatch, submitTokens } = require("./problemsUtility");

// In-memory store (no DB). For production, move to Redis or a DB.
const rooms = {};

/* ---------- Helper functions ---------- */

// Mock / replace with real DB fetch
async function fetchProblemsFromDB(count = 3) {
  // return array of problem meta (id,title,difficulty).

  const problems = await Problem.aggregate([
    { $match: { difficulty: "easy" } },
    { $sample: { size: count } },
  ]);

  return problems;
}

// call Judge0 (example). Replace JUDGE0_URL & headers appropriately.
async function runJudge0Submission({ code, problemId, language }) {
  try {
    //checking if everything is present...
    if (!problemId || !code || !language) {
      return res.status(401).send("Submission data field is missing!");
    }

    //fetching the problem from db
    const problembyId = await Problem.findById(problemId);

    const languageId = getLanguageId(language);

    const submissions = problembyId.hiddenTestCases.map(
      ({ input, output }) => ({
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      })
    );

    const submitResult = await submitBatch(submissions);

    const tokenArray = submitResult?.map((obj) => obj.token);

    const testResult = await submitTokens(tokenArray);
    //console.log(testResult);

    let testCasesPassed = 0;
    let error = null;
    let runtime = 0;
    let memorySpace = 0;
    let submissionStatus = "";
    let totaltestcases = testResult ? Object.keys(testResult).length : 0;

    for (const { status_id, status, stderr, time, memory } of testResult) {
      if (status_id == 3) {
        testCasesPassed++;
        runtime = Math.max(runtime, time);
        memorySpace = Math.max(memorySpace, memory);
        submissionStatus = status?.description;
      } else {
        submissionStatus = status?.description;
        error = stderr;
      }
    }

    const reply = {
      runtime: runtime,
      memory: memorySpace,
      testCasesPassed: testCasesPassed ? testCasesPassed : 0,
      submissionStatus: submissionStatus,
      totalTestCases: totaltestcases,
      error: error,
    };
    return reply;
  } catch (err) {
    console.log("Judge0 error ", err || err?.message);
  }
}

// Compute and return a sorted standings array
function computeStandings(room) {
  const list = Object.values(room.players).map((p) => ({
    username: p.username,
    playerId: p.playerId,
    solved: p.solved,
    totalTimeMs: p.totalTimeMs || 0,
  }));
  // sort: solved desc, then totalTime asc
  list.sort((a, b) => {
    if (b.solved !== a.solved) return b.solved - a.solved;
    return a.totalTimeMs - b.totalTimeMs;
  });
  console.log("this is the computed standings list in backend : ", list);
  return list;
}

/* ---------- Socket.IO event handlers ---------- */

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  // Create room - ack pattern: client passes callback which receives data
  socket.on("createRoom", async (options = {}, ack) => {
    try {
      console.log("Creating room in backend!");
      const roomId = Math.random().toString(36).slice(2, 9); // short shareable id
      const hostPlayerId = uuidv4(); // stable id to hand to client for reconnects
      const problems = await fetchProblemsFromDB(3);

      // init room
      rooms[roomId] = {
        roomId,
        hostSocketId: socket.id,
        status: "waiting",
        startTime: null,
        durationMs: options.durationMs || 20 * 60 * 1000, // default 20 minutes
        problems,
        problemState: {}, // init below
        players: {},
        timer: null,
        tickInterval: null,
      };

      // initialize problemState
      for (const p of problems)
        rooms[roomId].problemState[p.id] = { solvedBy: null, solvedAt: null };

      // join and add host to players
      socket.join(roomId);
      rooms[roomId].players[socket.id] = {
        playerId: hostPlayerId,
        username: options.username || "Host",
        socketId: socket.id,
        solved: 0,
        totalTimeMs: 0,
        solvedAt: {},
        currentProblemId: null,
      };

      // respond to creator with roomId & playerId
      if (typeof ack === "function")
        ack({ ok: true, roomId, playerId: hostPlayerId });
      io.to(roomId).emit("updatePlayers", computeStandings(rooms[roomId]));
    } catch (err) {
      console.error("createRoom error", err);
      if (typeof ack === "function") ack({ ok: false, error: "create-failed" });
    }
  });

  // Join room
  socket.on("joinRoom", async ({ roomId, username, playerId } = {}, ack) => {
    const room = rooms[roomId];
    if (!room) {
      if (typeof ack === "function")
        ack({ ok: false, error: "Room not found" });
      return;
    }

    // simple capacity check (2 players) - change if you want more
    if (Object.keys(room.players).length >= 2) {
      if (typeof ack === "function") ack({ ok: false, error: "Room full" });
      return;
    }

    socket.join(roomId);

    // create a server-side player record keyed by socket.id
    const newPlayerId = playerId || uuidv4();
    room.players[socket.id] = {
      playerId: newPlayerId,
      username: username || "Guest",
      socketId: socket.id,
      solved: 0,
      totalTimeMs: 0,
      solvedAt: {},
      currentProblemId: null,
    };

    io.to(roomId).emit("updatePlayers", computeStandings(room));
    if (typeof ack === "function")
      ack({ ok: true, roomId, playerId: newPlayerId, problems: room.problems });
    socket.broadcast.emit("new_player_join_message", { ok: true, username });
  });

  // Client can request the current room snapshot (for reconnection / refresh)
  socket.on("getRoomState", ({ roomId } = {}, ack) => {
    try {
      const room = rooms[roomId];
      if (!room) {
        if (typeof ack === "function") ack({ ok: false, error: "Room not found" });
        return;
      }

      const players = computeStandings(room);
      const snapshot = {
        roomId: room.roomId,
        status: room.status,
        startTime: room.startTime,
        durationMs: room.durationMs,
        problems: room.problems,
        players,
      };

      if (typeof ack === "function") ack({ ok: true, room: snapshot });
    } catch (err) {
      console.error("getRoomState error", err);
      if (typeof ack === "function") ack({ ok: false, error: "internal" });
    }
  });

  // Accept "start" from host explicitly if you prefer:
  socket.on("requestStart", ({ roomId } = {}) => {
    const room = rooms[roomId];
    if (!room) return;
    // Optionally check that socket.id === room.hostSocketId
    startCompetition(roomId);
  });

  // optional: client notifies which problem they opened
  socket.on("switchProblem", ({ roomId, problemId } = {}) => {
    const room = rooms[roomId];
    if (!room) return;
    const player = room.players[socket.id];
    if (!player) return;
    player.currentProblemId = problemId;
    // broadcast who is looking at which problem (optional)
    io.to(roomId).emit("playerSwitchedProblem", {
      playerId: player.playerId,
      username: player.username,
      problemId,
    });
  });

  //   // Optional: codeChange for spectating (debounce on client)
  //   socket.on('codeChange', ({ roomId, problemId, code } = {}) => {
  //     // Broadcast to others in room (not back to sender)
  //     socket.to(roomId).emit('codeUpdate', { fromSocketId: socket.id, problemId, code });
  //   });

  // submitSolution -> server validates via Judge0 and then marks solved
  socket.on(
    "submitSolution",
    async ({ roomId, problemId, code, language } = {}, ack) => {
      const room = rooms[roomId];
      console.log("this is submit room : ", room);
      console.log("this is status of room : ", room?.status);
      if (!room || room.status !== "running") {
        if (typeof ack === "function")
          ack({ ok: false, error: "Room not running" });
        return;
      }
      const player = room.players[socket.id];
      if (!player) {
        if (typeof ack === "function") ack({ ok: false, error: "Not in room" });
        return;
      }

      // Run Judge0 (server-side). Always validate server-side.
      const judgeResult = await runJudge0Submission({
        code,
        problemId,
        language,
      });
      console.log("this is submission room result in backend : ", judgeResult);
      // send immediate result back to submitter
      if (typeof ack === "function")
        ack({ ok: true, reply: { ...judgeResult } });

      // If accepted, mark solved (atomic server check)
      if (judgeResult?.submissionStatus === "Accepted") {
        // update player's own solved state only if they haven't solved this problem already
        if (!player.solvedAt[problemId]) {
          player.solved += 1;
          const timeSinceStart = Date.now() - room.startTime;
          player.totalTimeMs += timeSinceStart;
          player.solvedAt[problemId] = Date.now();
        }

        // Broadcast updated scoreboard
        io.to(roomId).emit("updateScoreboard", computeStandings(room));

        // // If all problems solved by all players combined -> end competition
        // const AreAllNotSolved = Object.values(room.players).some(obj=>{
        //    return obj?.solved < room?.problems?.length;
        // })
        // if(!AreAllNotSolved){
        //   endCompetition(roomId);
        // }

        // If any player has solved all problems -> end competition
        const hasAnyPlayerCompleted = Object.values(room.players).some(
          (player) => {
            return player.solved >= room?.problems?.length;
          }
        );

        if (hasAnyPlayerCompleted) {
          endCompetition(roomId);
        }
      }
    }
  );

  // Disconnect handling (grace period for reconnect)
  socket.on("disconnect", () => {
    // Find room(s) where this socket was present
    for (const roomId of Object.keys(rooms)) {
      const room = rooms[roomId];
      if (!room) continue;
      if (room.players[socket.id]) {
        // leave logically but keep a grace period (e.g., 60s) in case of reconnect
        console.log("player disconnected from room", roomId, socket.id);
        io.to(roomId).emit("playerLeft", { socketId: socket.id });
        // mark socket as disconnected but keep player data for reconnection mapping
        // Implementation options:
        // 1) Keep player record but remove socket.id mapping (store lastSocketId)
        // 2) Or set a timer and if not reconnected within timeout, remove player and end contest
        // For brevity, we'll immediately remove and end if <2 players left:
        delete room.players[socket.id];
        io.to(roomId).emit("updateScoreboard", computeStandings(room));
        // If no players left -> cleanup
        if (Object.keys(room.players).length === 0) {
          clearTimeout(room.timer);
          clearInterval(room.tickInterval);
          delete rooms[roomId];
        } else {
          // optional: if only one player left, you could end contest or keep running
          io.to(roomId).emit("playerLeft", { socketId: socket.id });
          endCompetition(roomId);
        }
      }
    }
  });

  /* ---------- helpers inside connection scope ---------- */

  // startCompetition helper: freezes room->status, sets timers and emits start msg
  async function startCompetition(roomId) {
    const room = rooms[roomId];
    const players = computeStandings(rooms[roomId]);
    if (!room || room.status === "running") return;
    room.status = "running";
    room.startTime = Date.now();

    // broadcast start with problem meta (no hidden tests)
    io.to(roomId).emit("startCompetition", {
      problems: room.problems,
      startTime: room.startTime,
      durationMs: room.durationMs,
      players,
      roomId,
    });

    // set a per-room timeout to end contest
    room.timer = setTimeout(() => endCompetition(roomId), room.durationMs);

    // optional: emit countdown every second
    room.tickInterval = setInterval(() => {
      const timeLeft = Math.max(
        0,
        room.startTime + room.durationMs - Date.now()
      );
      io.to(roomId).emit("tick", { timeLeftMs: timeLeft });
      if (timeLeft <= 0) clearInterval(room.tickInterval);
    }, 1000);
  }

  // endCompetition helper: compute final standings, emit, clear resources
  function endCompetition(roomId) {
    const room = rooms[roomId];
    if (!room) return;
    room.status = "finished";
    const standings = computeStandings(room);
    io.to(roomId).emit("endCompetition", standings);
    // cleanup
    clearTimeout(room.timer);
    clearInterval(room.tickInterval);
    delete rooms[roomId];
  }
});
