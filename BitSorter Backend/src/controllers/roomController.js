const { io } = require("../index");
const Problem = require("../models/problem");
const { userSubmission, runCode } = require("../controllers/userSubmission");
const axiosClient = require("../config/axiosClient");
const { v4: uuidv4 } = require("uuid");
const getLanguageId = require("../utils/getLanguageId");
const redisClient = require("../config/RedisConnect");

const Submission = require("../models/submission");
const { submitBatch, submitTokens } = require("./problemsUtility");

// In-memory timers per room (Redis cannot store functions)
const roomTimers = {};

/* ---------- Helper functions ---------- */

// Redis helpers
async function saveRoomToRedis(roomId, roomData) {
  await redisClient.set(`room:${roomId}`, JSON.stringify(roomData), "EX", 60 * 60); // 1 hour TTL
}

async function getRoomFromRedis(roomId) {
  const data = await redisClient.get(`room:${roomId}`);
  return data ? JSON.parse(data) : null;
}

async function deleteRoomFromRedis(roomId) {
  await redisClient.del(`room:${roomId}`);
}

// Mock / replace with real DB fetch
async function fetchProblemsFromDB(count = 3) {
  const problems = await Problem.aggregate([
    { $match: { difficulty: "easy" } },
    { $sample: { size: count } },
  ]);
  return problems;
}

// call Judge0 (same as your original)
async function runJudge0Submission({ code, problemId, language }) {
  try {
    if (!problemId || !code || !language) return null;

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

    let testCasesPassed = 0;
    let error = null;
    let runtime = 0;
    let memorySpace = 0;
    let submissionStatus = "";
    let totaltestcases = testResult ? Object.keys(testResult).length : 0;

    for (const { status_id, status, stderr, time, memory } of testResult) {
      if (status_id === 3) {
        testCasesPassed++;
        runtime = Math.max(runtime, time);
        memorySpace = Math.max(memorySpace, memory);
        submissionStatus = status?.description;
      } else {
        submissionStatus = status?.description;
        error = stderr;
      }
    }

    return {
      runtime,
      memory: memorySpace,
      testCasesPassed,
      submissionStatus,
      totalTestCases: totaltestcases,
      error,
    };
  } catch (err) {
    console.log("Judge0 error", err || err?.message);
    return null;
  }
}

// Compute and return sorted standings
function computeStandings(room) {
  const list = Object.values(room.players).map((p) => ({
    username: p.username,
    playerId: p.playerId,
    solved: p.solved,
    totalTimeMs: p.totalTimeMs || 0,
  }));
  list.sort((a, b) => {
    if (b.solved !== a.solved) return b.solved - a.solved;
    return a.totalTimeMs - b.totalTimeMs;
  });
  console.log("Computed standings:", list);
  return list;
}

/* ---------- Socket.IO ---------- */

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  // Create room
  socket.on("createRoom", async (options = {}, ack) => {
    try {
      console.log("Creating room in backend!");
      const roomId = Math.random().toString(36).slice(2, 9);
      const hostPlayerId = uuidv4();
      const problems = await fetchProblemsFromDB(3);

      const room = {
        roomId,
        hostSocketId: socket.id,
        status: "waiting",
        startTime: null,
        durationMs: 30 * 60 * 1000,
        problems,
        problemState: {},
        players: {},
      };

      for (const p of problems)
        room.problemState[p.id] = { solvedBy: null, solvedAt: null };

      room.players[socket.id] = {
        playerId: hostPlayerId,
        username: options.username || "Host",
        socketId: socket.id,
        solved: 0,
        totalTimeMs: 0,
        solvedAt: {},
        currentProblemId: null,
      };

      socket.join(roomId);
      await saveRoomToRedis(roomId, room);

      if (typeof ack === "function")
        ack({ ok: true, roomId, playerId: hostPlayerId });

      io.to(roomId).emit("updatePlayers", computeStandings(room));
    } catch (err) {
      console.error("createRoom error", err);
      if (typeof ack === "function") ack({ ok: false, error: "create-failed" });
    }
  });

  // Join room
  socket.on("joinRoom", async ({ roomId, username, playerId } = {}, ack) => {
    const room = await getRoomFromRedis(roomId);
    if (!room) {
      console.log("Room not found for join:", roomId);
      return ack?.({ ok: false, error: "Room not found" });
    }

    if (Object.keys(room.players).length >= 2) {
      console.log("Room full:", roomId);
      return ack?.({ ok: false, error: "Room full" });
    }

    socket.join(roomId);
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

    await saveRoomToRedis(roomId, room);

    io.to(roomId).emit("updatePlayers", computeStandings(room));
    ack?.({ ok: true, roomId, playerId: newPlayerId, problems: room.problems });
    socket.broadcast.emit("new_player_join_message", { ok: true, username });
  });

  // Get room snapshot
  socket.on("getRoomState", async ({ roomId } = {}, ack) => {
    const room = await getRoomFromRedis(roomId);
    if (!room) {
      console.log("Room not found for snapshot:", roomId);
      return ack?.({ ok: false, error: "Room not found" });
    }

    ack?.({ ok: true, room: { ...room, players: computeStandings(room) } });
  });

  // Start competition
  socket.on("requestStart", async ({ roomId } = {}) => {
    console.log("Start requested for room:", roomId);
    const room = await getRoomFromRedis(roomId);
    if (!room) return;
    startCompetition(roomId);
  });

  // Switch problem
  socket.on("switchProblem", async ({ roomId, problemId } = {}) => {
    const room = await getRoomFromRedis(roomId);
    if (!room) return;

    const player = room.players[socket.id];
    if (!player) return;

    player.currentProblemId = problemId;
    await saveRoomToRedis(roomId, room);

    io.to(roomId).emit("playerSwitchedProblem", {
      playerId: player.playerId,
      username: player.username,
      problemId,
    });
  });

  // Submit solution
  socket.on(
    "submitSolution",
    async ({ roomId, problemId, code, language } = {}, ack) => {
      const room = await getRoomFromRedis(roomId);
      console.log("Submit solution in room:", roomId, room?.status);
      if (!room || room.status !== "running")
        return ack?.({ ok: false, error: "Room not running" });

      const player = room.players[socket.id];
      if (!player) return ack?.({ ok: false, error: "Not in room" });

      const judgeResult = await runJudge0Submission({ code, problemId, language });
      console.log("Judge0 result:", judgeResult);
      ack?.({ ok: true, reply: judgeResult });

      if (judgeResult?.submissionStatus === "Accepted" && !player.solvedAt[problemId]) {
        player.solved += 1;
        player.totalTimeMs += Date.now() - room.startTime;
        player.solvedAt[problemId] = Date.now();
        await saveRoomToRedis(roomId, room);

        io.to(roomId).emit("updateScoreboard", computeStandings(room));

        const anyCompleted = Object.values(room.players).some(
          (p) => p.solved >= room.problems.length
        );
        if (anyCompleted) endCompetition(roomId);
      }
    }
  );

  socket.on("leaveRoom", async ({ roomId,playerId } = {},ack) => {
    const room = await getRoomFromRedis(roomId);
    if (!room) return;

    if(!room.players[socket.id]) return;

    delete room.players[socket.id];
    endCompetition(roomId);
    ack({ok:true});
    await saveRoomToRedis(roomId, room);
  });
  // Disconnect
  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);
    const keys = await redisClient.keys("room:*");
    for (const key of keys) {
      const room = await getRoomFromRedis(key.split(":")[1]);
      if (!room) continue;
      if (!room.players[socket.id]) continue;

      delete room.players[socket.id];
      await saveRoomToRedis(room.roomId, room);

      io.to(room.roomId).emit("updateScoreboard", computeStandings(room));

      if (Object.keys(room.players).length === 0) {
        clearTimeout(roomTimers[room.roomId]?.timer);
        clearInterval(roomTimers[room.roomId]?.tickInterval);
        delete roomTimers[room.roomId];
        await deleteRoomFromRedis(room.roomId);
        console.log("Room cleaned up from Redis:", room.roomId);
      } else {
        endCompetition(room.roomId);
      }
    }
  });

  // Start competition helper
  async function startCompetition(roomId) {
    const room = await getRoomFromRedis(roomId);
    if (!room || room.status === "running") return;

    room.status = "running";
    room.startTime = Date.now();
    await saveRoomToRedis(roomId, room);

    io.to(roomId).emit("startCompetition", {
      problems: room.problems,
      startTime: room.startTime,
      durationMs: room.durationMs,
      players: computeStandings(room),
      roomId,
    });

    roomTimers[roomId] = {};
    roomTimers[roomId].timer = setTimeout(() => endCompetition(roomId), room.durationMs);
    roomTimers[roomId].tickInterval = setInterval(() => {
      const timeLeft = Math.max(0, room.startTime + room.durationMs - Date.now());
      io.to(roomId).emit("tick", { timeLeftMs: timeLeft });
      if (timeLeft <= 0) clearInterval(roomTimers[roomId].tickInterval);
    }, 1000);

    console.log("Competition started for room:", roomId);
  }

  // End competition helper
  async function endCompetition(roomId) {
    const room = await getRoomFromRedis(roomId);
    if (!room) return;

    room.status = "finished";
    await saveRoomToRedis(roomId, room);

    io.to(roomId).emit("endCompetition", computeStandings(room));

    clearTimeout(roomTimers[roomId]?.timer);
    clearInterval(roomTimers[roomId]?.tickInterval);
    delete roomTimers[roomId];

    await deleteRoomFromRedis(roomId);
    console.log("Competition ended and room deleted:", roomId);
  }
});
