import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomData: {
    durationMs: null,
    roomId: null,
    startTime: null,
    problems: [],
    players: [],
  },
  roomHasEnded: false,
};

const computeScore = (solved, totalTimeMs) => {
  const solvedCount = Number(solved) || 0;
  if (solvedCount === 0) return 0;
  const timeMs = Number(totalTimeMs) || 0;
  const timeBonus = Math.max(0, 100 - timeMs / 60000);
  return Math.round(solvedCount * 100 + timeBonus);
};

const normalizePlayers = (players) =>
  (players || []).map((player) => ({
    ...player,
    solved: Number(player.solved) || 0,
    totalTimeMs: Number(player.totalTimeMs) || 0,
    score: computeScore(player.solved, player.totalTimeMs),
  }));

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomData: (state, action) => {
      state.roomData = {
        ...action.payload,
        players: normalizePlayers(action.payload.players),
      };
      state.roomHasEnded = false; // reset ended flag when joining/setting room
    },
    updatePlayers: (state, action) => {
      state.roomData.players = normalizePlayers(action.payload);
    },
    deletePlayer: (state, action) => {
      state.roomData.players = state.roomData.players.filter(
        (player) => player.playerId !== action.payload
      );
    },
    // Clear room data (used when user explicitly leaves / after back navigation)
    clearRoom: (state) => {
      state.roomData = initialState.roomData;
      state.roomHasEnded = false;
    },
    // Explicit setter so components can mark the room as ended (and keep data visible)
    setRoomHasEnded: (state, action) => {
      state.roomHasEnded = action.payload;
    },
  },
});

export const {
  setRoomData,
  updatePlayers,
  deletePlayer,
  clearRoom,
  setRoomHasEnded,
} = roomSlice.actions;
export default roomSlice.reducer;