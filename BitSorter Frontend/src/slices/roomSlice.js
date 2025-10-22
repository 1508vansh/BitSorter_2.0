import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomData: {
    durationMs: null,
    roomId: null,
    startTime: null,
    problems: [], // array of player objects
    players: [],
  },
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Set full room data (when joining or creating)
    setRoomData: (state, action) => {
      state.roomData = action.payload;
      console.log("Room data set in slice:", state.roomData);
    },

    // Update only players list (when receiving socket updates)
    updatePlayers: (state, action) => {
      state.roomData.players = action.payload;
    },

    deletePlayer: (state, action) => {
      state.roomData.players = state.roomData.players.filter(
        (player) => player.socketId !== action.payload
      );
    },
    // Clear room on exit
    clearRoom: (state) => {
      state.roomData = initialState.roomData;
      console.log("Room data cleared from slice");
    },
  },
});

export const { setRoomData, updatePlayers, deletePlayer, clearRoom } =
  roomSlice.actions;

export default roomSlice.reducer;
