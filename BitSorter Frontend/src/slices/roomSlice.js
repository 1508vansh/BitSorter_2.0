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

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomData: (state, action) => {
      state.roomData = action.payload;
      state.roomHasEnded = false; // reset ended flag when joining/setting room
    },
    updatePlayers: (state, action) => {
      state.roomData.players = action.payload;
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