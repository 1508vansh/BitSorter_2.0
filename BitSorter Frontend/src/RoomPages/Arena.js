import { useEffect, useState } from "react";
import socket from "../Connections/socket";
import { Link, useNavigate } from "react-router";
import {
  setRoomData,
  deletePlayer,
  clearRoom,
  updatePlayers,
  setRoomHasEnded,
} from "../slices/roomSlice";
import { useDispatch, useSelector } from "react-redux";
import AnimatedWrapper from "../Ui/AnimatedWrapper";

export default function Arena() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const roomHasEnded = useSelector((state) => state?.room?.roomHasEnded);
  const roomData = useSelector((state) => state?.room?.roomData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("host");
  const [roomId, setRoomId] = useState("");
  const [joinedPlayer, setJoinedPlayer] = useState(false);
  const [joinedPlayerMessage, setJoinedPlayerMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [winner, setWinner] = useState(null);

  const playerId = localStorage.getItem("playerId");
  const isInRoom = roomData?.players?.some(player => player.playerId === playerId);
  
  // FIXED: Only show Enter Arena when competition has started AND user is in room AND competition hasn't ended
  const canShowEnterArena = isInRoom && hasStarted && !roomHasEnded;

  // calculate score
  function simpleScore(problemsSolved, totalTimeMs) {
    const base = problemsSolved * 100;
    const timeBonus = Math.max(0, 100 - totalTimeMs / 60000);
    return Math.round(base + timeBonus);
  }

  const CreateRoom = () => {
    if (roomId) return;
    socket.emit(
      "createRoom",
      { durationMs: 60 * 10 * 1000, username: userName },
      (res) => {
        if (res?.ok) {
          setRoomId(res?.roomId);
          if (res?.playerId) localStorage.setItem("playerId", res?.playerId);
        } else {
          alert("Room cannot be created!");
        }
      }
    );
  };

  const JoinTheRoom = () => {
    if (joinRoomId.length < 2) return;
    socket.emit(
      "joinRoom",
      { roomId: joinRoomId, username: userName },
      (res) => {
        if (res?.ok) {
          setJoined(true);
          localStorage.setItem("playerId", res?.playerId);
        } else {
          alert("Room doesn't exist!");
        }
      }
    );
  };

  const StartTheArena = () => {
    socket.emit("requestStart", { roomId });
  };

  // Enhanced restore RoomData on mount with getRoomState
  useEffect(() => {
    const restoreRoomState = async () => {
      try {
        const rd = JSON.parse(localStorage.getItem("RoomData"));
        const pid = localStorage.getItem("playerId");
        const roomId = rd?.roomId;
        
        if (rd && pid && roomId) {
          // Call getRoomState to get fresh data from Redis
          socket.emit("getRoomState", { roomId }, (response) => {
            if (response?.ok && response?.room) {
              const freshRoomData = response.room;
              const isUserInRoom = freshRoomData.players.some(player => 
                player.playerId === pid || player.id === pid
              );
              
              if (isUserInRoom) {
                setHasStarted(Boolean(freshRoomData.startTime));
                dispatch(setRoomData(freshRoomData));
                localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
                
                // Check if competition ended
                if (freshRoomData.endTime && Date.now() > freshRoomData.endTime) {
                  dispatch(setRoomHasEnded(true));
                }
              } else {
                // User not in room anymore, clear data
                dispatch(clearRoom());
                localStorage.removeItem("RoomData");
                localStorage.removeItem("playerId");
              }
            } else {
              // Room doesn't exist on server
              dispatch(clearRoom());
              localStorage.removeItem("RoomData");
              localStorage.removeItem("playerId");
            }
          });
        }
      } catch (err) {
        console.error("Error restoring room state:", err);
      }
    };

    restoreRoomState();
  }, [dispatch]);

  // Handle Enter Arena with room state verification
  const handleEnterArena = () => {
    const roomId = roomData?.roomId;
    const playerId = localStorage.getItem("playerId");
    
    if (roomId && playerId) {
      // Verify room state before navigating
      socket.emit("getRoomState", { roomId }, (response) => {
        if (response?.ok && response?.room) {
          const freshRoomData = response.room;
          const isUserInRoom = freshRoomData.players.some(player => 
            player.playerId === playerId
          );
          
          if (isUserInRoom) {
            // Update state and navigate
            dispatch(setRoomData(freshRoomData));
            localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
            navigate('/RoomProblemSection');
          } else {
            alert("You are no longer in this room");
            dispatch(clearRoom());
            localStorage.removeItem("RoomData");
            localStorage.removeItem("playerId");
          }
        } else {
          alert("Room no longer exists");
          dispatch(clearRoom());
          localStorage.removeItem("RoomData");
          localStorage.removeItem("playerId");
        }
      });
    } else {
      navigate('/RoomProblemSection');
    }
  };

  // Page visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, refresh room state
        const rd = JSON.parse(localStorage.getItem("RoomData"));
        const roomId = rd?.roomId;
        
        if (roomId) {
          socket.emit("getRoomState", { roomId }, (response) => {
            if (response?.ok && response?.room) {
              const freshRoomData = response.room;
              dispatch(setRoomData(freshRoomData));
              localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
              
              if (freshRoomData.endTime && Date.now() > freshRoomData.endTime) {
                dispatch(setRoomHasEnded(true));
              }
            }
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleScoreboardUpdate = (data) => {
      const updatedPlayers = data?.map((player) => ({
        ...player,
        playerId: player.playerId,
        score: simpleScore(player.solved, player.totalTimeMs),
        timeMs: player.totalTimeMs,
        problemsSolved: player.solved,
      }));
      dispatch(updatePlayers(updatedPlayers));
      // persist players so returning users see updated scoreboard
      try {
        const rd = JSON.parse(localStorage.getItem("RoomData")) || {};
        rd.players = updatedPlayers;
        localStorage.setItem("RoomData", JSON.stringify(rd));
      } catch (err) {
        // ignore
      }
    };

    const onNewPlayer = (data) => {
      if (data?.ok) {
        setJoinedPlayer(true);
        setJoinedPlayerMessage(`${data?.username} has joined the arena!`);
      }
    };

    const onStartCompetition = (data) => {
      setHasStarted(true);
      dispatch(setRoomHasEnded(false));
      const updatedPlayers = data?.players?.map((player) => ({
        ...player,
        playerId: player?.playerId,
        score: 0,
        timeMs: player?.totalTimeMs,
        problemsSolved: player?.solved,
      }));
      const newData = { ...data, players: updatedPlayers };
      dispatch(setRoomData(newData));
      localStorage.setItem("RoomData", JSON.stringify(newData));
    };

    const onPlayerLeft = (data) => {
      dispatch(deletePlayer(data?.socketId));
      // don't clear localStorage here; keep room view for remaining users
    };

    const endCompetition = (standings) => {
      if (standings && standings.length > 0) {
        const winnerPlayer = standings[0];
        setWinner(winnerPlayer.playerId);

        // Update players in Redux and persist to localStorage so leaderboard remains visible
        const updatedPlayers = standings?.map((player) => ({
          id: player.playerId,
          playerId: player.playerId,
          username: player.username,
          score: simpleScore(player.solved, player.totalTimeMs),
          timeMs: player.totalTimeMs,
          problemsSolved: player.solved,
        })) || [];

        dispatch(updatePlayers(updatedPlayers));

        try {
          const rd = JSON.parse(localStorage.getItem("RoomData")) || {};
          rd.players = updatedPlayers;
          localStorage.setItem("RoomData", JSON.stringify(rd));
        } catch (err) {
          // ignore
        }

        // mark room ended (do NOT clear data here)
        dispatch(setRoomHasEnded(true));
        setHasStarted(false);
      }
    };

    socket.on("updateScoreboard", handleScoreboardUpdate);
    socket.on("updatePlayers", handleScoreboardUpdate);
    socket.on("new_player_join_message", onNewPlayer);
    socket.on("startCompetition", onStartCompetition);
    socket.on("playerLeft", onPlayerLeft);
    socket.on("endCompetition", endCompetition);

    return () => {
      socket.off("updateScoreboard", handleScoreboardUpdate);
      socket.off("updatePlayers", handleScoreboardUpdate);
      socket.off("new_player_join_message", onNewPlayer);
      socket.off("startCompetition", onStartCompetition);
      socket.off("playerLeft", onPlayerLeft);
      socket.off("endCompetition", endCompetition);
    };
  }, [dispatch]);

  // Clear room only on browser back (popstate)
  useEffect(() => {
    const handleBack = () => {
      // When user navigates back and the competition had ended, clear the stored room
      const stored = JSON.parse(localStorage.getItem("RoomData"));
      if (stored && (stored.players?.length || 0) && dispatch) {
        // only clear if stored data exists (and competition ended in Redux)
        dispatch(clearRoom());
        localStorage.removeItem("RoomData");
        localStorage.removeItem("playerId");
        dispatch(setRoomHasEnded(false));
      }
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [dispatch]);

  return (
    <AnimatedWrapper>
      <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        {/* Main Container */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${isDark ? "bg-blue-600" : "bg-blue-500"} text-white font-semibold`}>
              1V1 CODE DUEL
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to the Arena</h1>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Challenge other coders in real-time programming battles
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            {/* Show Create and Join only when user is NOT in an active room */}
            {!isInRoom && (
              <>
                <button
                  onClick={() => document.getElementById("create_modal").showModal()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                  Create Room
                </button>

                <button
                  onClick={() => document.getElementById("join_modal").showModal()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  Join Room
                </button>
              </>
            )}

            {/* FIXED: Show Enter Arena only when user is in room AND competition has started AND competition hasn't ended */}
            {canShowEnterArena && (
              <button
                onClick={handleEnterArena}
                className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"}`}
              >
                Enter Arena
              </button>
            )}
          </div>

          {/* Create Room Modal */}
          <dialog id="create_modal" className="modal">
            <div className={`modal-box max-w-md ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
              <h3 className="font-bold text-xl mb-4">Create Coding Room</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                  />
                </div>
                <button
                  onClick={CreateRoom}
                  disabled={!userName.trim() || isInRoom}
                  className={`w-full py-3 rounded-lg font-semibold ${!userName.trim() || isInRoom ? "bg-gray-400 cursor-not-allowed" : isDark ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"} text-white`}
                >
                  {isInRoom ? "Already in a Room" : "Create Room"}
                </button>

                {roomId && (
                  <div className={`p-4 rounded-lg border ${isDark ? "bg-gray-700 border-green-500" : "bg-green-50 border-green-400"}`}>
                    <p className="font-semibold text-green-600 mb-1">Room Created!</p>
                    <p className={`font-mono text-lg ${isDark ? "text-white" : "text-gray-900"}`}>{roomId}</p>
                    <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Share this code with your opponent</p>
                  </div>
                )}

                {joinedPlayer ? (
                  <div className={`p-3 rounded-lg border ${isDark ? "bg-green-900 border-green-600" : "bg-green-100 border-green-400"}`}>
                    <p className="text-green-600 font-medium text-center">{joinedPlayerMessage}</p>
                  </div>
                ) : (
                  <div className={`p-3 rounded-lg border ${isDark ? "bg-blue-900 border-blue-600" : "bg-blue-100 border-blue-400"}`}>
                    <p className="text-blue-600 text-center">Waiting for opponent to join...</p>
                  </div>
                )}

                <button
                  className={`w-full py-3 rounded-lg font-semibold ${!joinedPlayer || hasStarted ? "bg-gray-400 cursor-not-allowed" : isDark ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"} text-white`}
                  disabled={!joinedPlayer || hasStarted}
                  onClick={StartTheArena}
                >
                  Start Competition
                </button>

                {/* FIXED: Only show Enter Competition in modal when competition has started */}
                {hasStarted && isInRoom && !roomHasEnded && (
                  <button
                    onClick={handleEnterArena}
                    className={`block w-full py-3 text-center rounded-lg font-semibold ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white`}
                  >
                    Enter Competition
                  </button>
                )}
              </div>
              <div className="modal-action mt-6">
                <form method="dialog">
                  <button className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>Close</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Join Room Modal */}
          <dialog id="join_modal" className="modal">
            <div className={`modal-box max-w-md ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
              <h3 className="font-bold text-xl mb-4">Join Coding Room</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Room Code</label>
                  <input
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    type="text"
                    placeholder="Enter room code"
                    className={`w-full px-3 py-2 rounded-lg border font-mono ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                  />
                </div>
                <button
                  onClick={JoinTheRoom}
                  disabled={joined || !userName.trim() || !joinRoomId.trim() || isInRoom}
                  className={`w-full py-3 rounded-lg font-semibold ${joined || !userName.trim() || !joinRoomId.trim() || isInRoom ? "bg-gray-400 cursor-not-allowed" : isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                >
                  {isInRoom ? "Already in a Room" : joined ? "Joined Successfully!" : "Join Room"}
                </button>

                {/* FIXED: Only show Enter Competition in modal when competition has started */}
                {hasStarted && isInRoom && !roomHasEnded && (
                  <button
                    onClick={handleEnterArena}
                    className={`block w-full py-3 text-center rounded-lg font-semibold ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white`}
                  >
                    Enter Competition
                  </button>
                )}
              </div>
              <div className="modal-action mt-6">
                <form method="dialog">
                  <button className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}>Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
