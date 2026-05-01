export const clearRoomSession = () => {
  localStorage.removeItem("RoomData");
  localStorage.removeItem("playerId");
};
