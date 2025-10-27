import socket from "../Connections/socket";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import { updatePlayers, deletePlayer, clearRoom, setRoomHasEnded, setRoomData } from "../slices/roomSlice";

// ScoreCard Component
function MultiPlayerScoreCard({
  winner,
  players,
  totalProblems,
  isDark,
  currentUserId,
}) {
  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeMs - b.timeMs;
  });

  return (
    <div
      className={`relative rounded-2xl p-6 mb-8 shadow-2xl ${
        isDark
          ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
          : "bg-gradient-to-br from-white to-blue-50 border border-blue-100"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20 ${
          isDark ? "bg-purple-500" : "bg-blue-400"
        }`}
      ></div>

      <h2
        className={`text-2xl font-bold mb-6 text-center ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        {winner ? "Competition Over!" : "Live Leaderboard"}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <th className={`text-left py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Rank
              </th>
              <th className={`text-left py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Player
              </th>
              <th className={`text-center py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Score
              </th>
              <th className={`text-center py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Time
              </th>
              <th className={`text-center py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Solved
              </th>
              <th className={`text-center py-3 px-4 font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const problemsSolved = Number(player.solved) || 0;
              const totalProblemsCount = Number(totalProblems) || 1;
              const progressPercentage = totalProblemsCount > 0 ? (problemsSolved / totalProblemsCount) * 100 : 0;
              const isCurrentUser = player.playerId === currentUserId;
              const isWinner = player.playerId === winner;

              return (
                <tr
                  key={player?.playerId || player?.username}
                  className={`transition-all duration-300 ${
                    isWinner
                      ? "bg-green-500/30"
                      : isCurrentUser
                      ? isDark
                        ? "bg-blue-900/30 border-l-4 border-l-blue-400"
                        : "bg-blue-100 border-l-4 border-l-blue-500"
                      : isDark
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50"
                  } ${
                    index < sortedPlayers.length - 1
                      ? `border-b ${isDark ? "border-gray-700" : "border-gray-200"}`
                      : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-yellow-500 text-lg mr-2">{isWinner ? "🏆" : "🥇"}</span>}
                      {index === 1 && <span className="text-gray-400 text-lg mr-2">🥈</span>}
                      {index === 2 && <span className="text-orange-500 text-lg mr-2">🥉</span>}
                      {index > 2 && (
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm mr-2 ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mr-3 ${
                        isCurrentUser
                          ? "bg-blue-500 text-white"
                          : isDark
                          ? "bg-purple-500 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {player.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className={`font-medium ${isDark ? "text-white" : "text-gray-800"} ${isCurrentUser ? "font-bold" : ""}`}>
                        {player.username}
                        {isCurrentUser && !isWinner && (
                          <span className={`ml-2 text-xs ${isDark ? "text-blue-300" : "text-blue-600"}`}> (You) </span>
                        )}
                        {isWinner && (
                          <span className={`ml-2 text-xs font-bold ${isDark ? "text-green-300" : "text-green-600"}`}> (Winner!) </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold text-lg ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                      {player.score || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-mono font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>
                      {formatTime(player.totalTimeMs)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                      {problemsSolved}/{totalProblemsCount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progressPercentage === 100
                              ? isDark
                                ? "bg-green-500"
                                : "bg-green-400"
                              : isDark
                              ? "bg-purple-500"
                              : "bg-purple-400"
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs w-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Main RoomProblemSection ----
export default function RoomProblemSection() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const players = useSelector((state) => state?.room?.roomData?.players) || [];
  const roomHasEnded = useSelector((state) => state?.room?.roomHasEnded);
  const roomData = useSelector((state) => state?.room?.roomData);
  const [localRoomData, setLocalRoomData] = useState(() =>
    JSON.parse(localStorage.getItem("RoomData")) || {}
  );
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate score based on backend structure
  const simpleScore = (problemsSolved, totalTimeMs) => {
    const base = (Number(problemsSolved) || 0) * 100;
    const timeBonus = Math.max(0, 100 - (Number(totalTimeMs) || 0) / 60000);
    return Math.round(base + timeBonus);
  };

  // Format time left for display
  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Enhanced room state restoration to get fresh scorecard data
  useEffect(() => {
    const restoreRoomState = () => {
      try {
        const rd = JSON.parse(localStorage.getItem("RoomData"));
        const pid = localStorage.getItem("playerId");
        const roomId = rd?.roomId;
        
        if (rd && pid && roomId) {
          // Get fresh room state from server when component mounts
          socket.emit("getRoomState", { roomId }, (response) => {
            if (response?.ok && response?.room) {
              const freshRoomData = response.room;
              const isUserInRoom = freshRoomData.players.some(player => 
                player.playerId === pid
              );
              
              if (isUserInRoom) {
                dispatch(setRoomData(freshRoomData));
                setLocalRoomData(freshRoomData);
                
                // Update localStorage with fresh data
                localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
                
                // Check if competition ended
                if (freshRoomData.endTime && Date.now() > freshRoomData.endTime) {
                  dispatch(setRoomHasEnded(true));
                }
              } else {
                // User not in room, redirect to Arena
                dispatch(clearRoom());
                localStorage.removeItem("RoomData");
                localStorage.removeItem("playerId");
                navigate('/Arena');
              }
            } else {
              // Room doesn't exist, redirect to Arena
              dispatch(clearRoom());
              localStorage.removeItem("RoomData");
              localStorage.removeItem("playerId");
              navigate('/Arena');
            }
          });
        } else {
          // No room data, redirect to Arena
          navigate('/Arena');
        }
      } catch (err) {
        console.error("Error restoring room state:", err);
        navigate('/Arena');
      }
    };

    restoreRoomState();
  }, [dispatch, navigate]);

  // Socket listener for time updates
  useEffect(() => {
    const handleTick = (obj) => {
      console.log("Time Left in RoomProblemSection: ", obj?.timeLeftMs);
      setTimeLeft(obj?.timeLeftMs);
    };

    socket.on("tick", handleTick);

    return () => {
      socket.off("tick", handleTick);
    };
  }, []);

  // Leave Room Function
  const handleLeaveRoom = () => {
    const playerId = localStorage.getItem("playerId");
    const roomId = roomData?.roomId || localRoomData?.roomId;
    
    if (roomId && playerId) {
      socket.emit('leaveRoom', { roomId, playerId }, (response) => {
        if (response?.ok) {
          // Clear room data and redirect to Arena
          dispatch(clearRoom());
          localStorage.removeItem("RoomData");
          localStorage.removeItem("playerId");
          dispatch(setRoomHasEnded(false));
        } else {
          alert("Failed to leave room: " + (response?.error || "Unknown error"));
        }
      });
    } else {
      // Fallback: clear data anyway
      dispatch(clearRoom());
      localStorage.removeItem("RoomData");
      localStorage.removeItem("playerId");
      dispatch(setRoomHasEnded(false));
    }
    navigate('/Arena');
  };

  // ---- Socket listeners for real-time updates ----
  useEffect(() => {
    const handleScoreboardUpdate = (data) => {
      console.log("Scoreboard update received from backend:", data);
      
      // FIXED: Backend sends array of players with {username, playerId, solved, totalTimeMs}
      const updatedPlayers = (data || []).map((player) => ({
        username: player.username,
        playerId: player.playerId,
        solved: player.solved || 0,
        totalTimeMs: player.totalTimeMs || 0,
        // Calculate score based on backend data
        score: simpleScore(player.solved, player.totalTimeMs),
        // For display compatibility
        problemsSolved: player.solved || 0,
        timeMs: player.totalTimeMs || 0
      }));
      
      console.log("Processed players data:", updatedPlayers);
      dispatch(updatePlayers(updatedPlayers));

      // Update local storage with fresh data
      const currentRoomData = JSON.parse(localStorage.getItem("RoomData")) || {};
      const newRoomData = { ...currentRoomData, players: updatedPlayers };
      setLocalRoomData(newRoomData);
      localStorage.setItem("RoomData", JSON.stringify(newRoomData));
    };

    const handleUpdatePlayers = (data) => {
      console.log("UpdatePlayers event received:", data);
      // This is the same as updateScoreboard in your backend
      handleScoreboardUpdate(data);
    };

    const endCompetition = (standings) => {
      console.log("Competition ended with standings:", standings);
      if (!standings || standings.length === 0) return;
      
      const winnerPlayer = standings[0];
      setWinner(winnerPlayer.playerId);

      // update players in store with final standings
      const updatedPlayers = standings.map((player) => ({
        username: player.username,
        playerId: player.playerId,
        solved: player.solved || 0,
        totalTimeMs: player.totalTimeMs || 0,
        score: simpleScore(player.solved, player.totalTimeMs),
        problemsSolved: player.solved || 0,
        timeMs: player.totalTimeMs || 0
      }));

      console.log("Final players data:", updatedPlayers);
      dispatch(updatePlayers(updatedPlayers));

      // persist final players
      const currentRoomData = JSON.parse(localStorage.getItem("RoomData")) || {};
      const newRoomData = { ...currentRoomData, players: updatedPlayers };
      setLocalRoomData(newRoomData);
      localStorage.setItem("RoomData", JSON.stringify(newRoomData));

      // mark ended (do NOT clear data here)
      dispatch(setRoomHasEnded(true));
    };

    const onPlayerLeft = (data) => {
      if (data?.playerId) {
        dispatch(deletePlayer(data.playerId));
      }
    };

    // Listen to both events - backend sends both
    socket.on("updateScoreboard", handleScoreboardUpdate);
    socket.on("updatePlayers", handleUpdatePlayers);
    socket.on("playerLeft", onPlayerLeft);
    socket.on("endCompetition", endCompetition);

    return () => {
      socket.off("updateScoreboard", handleScoreboardUpdate);
      socket.off("updatePlayers", handleUpdatePlayers);
      socket.off("playerLeft", onPlayerLeft);
      socket.off("endCompetition", endCompetition);
    };
  }, [dispatch]);

  // Page visibility change handler - refresh data when user comes back to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh room state when user returns to tab
        const rd = JSON.parse(localStorage.getItem("RoomData"));
        const roomId = rd?.roomId;
        
        if (roomId) {
          socket.emit("getRoomState", { roomId }, (response) => {
            if (response?.ok && response?.room) {
              const freshRoomData = response.room;
              dispatch(setRoomData(freshRoomData));
              setLocalRoomData(freshRoomData);
              localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
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

  // ---- Clear room only on browser back after competition ended ----
  useEffect(() => {
    const handleBack = () => {
      if (roomHasEnded) {
        dispatch(clearRoom());
        localStorage.removeItem("RoomData");
        localStorage.removeItem("playerId");
        dispatch(setRoomHasEnded(false));
      }
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [roomHasEnded, dispatch]);

  return (
    <AnimatedWrapper>
      <div className={`min-h-screen p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {/* Time Counter - Top Left Corner */}
        {timeLeft > 0 &&
        <AnimatedWrapper>
          <div className="z-50">
            <span className={`px-4 py-2 rounded-lg font-bold text-lg ${isDark ? "bg-red-600 text-white" : "bg-red-500 text-white"} shadow-lg`}>
              Time Left: {formatTime(timeLeft)}
            </span>
          </div>
          </AnimatedWrapper>
         }

        <div className="max-w-6xl mx-auto">
          {/* Leave Room Button - Top Right */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLeaveRoom}
              className={`px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105 ${
                isDark 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Leave Room
            </button>
          </div>

          <MultiPlayerScoreCard
            winner={winner}
            players={players}
            totalProblems={roomData?.problems?.length || localRoomData?.problems?.length || 0}
            isDark={isDark}
            currentUserId={localStorage.getItem("playerId")}
          />

          {/* Arena Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}>
              Welcome to the Arena!
            </h1>
            <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Solve problems and climb the leaderboard
            </p>
          </div>

          {/* Problems List */}
          <div className={`rounded-2xl shadow-lg overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
            {(roomData?.problems || localRoomData?.problems || []).map((problem, index) => (
              <AnimatedWrapper key={problem._id}>
                <Link
                  to={roomHasEnded ? "#" : `/RoomProblem/${problem._id}`}
                  className={`block transition-all duration-300 hover:transform hover:scale-[1.02] ${
                    isDark
                      ? problem?.solved
                        ? "bg-green-300 hover:bg-green-500 text-white"
                        : index % 2 === 0
                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                        : "bg-gray-900 hover:bg-gray-700 text-white"
                      : problem?.solved
                      ? "bg-green-100 hover:bg-green-200"
                      : index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-100"
                  } border-b ${isDark ? "border-gray-700" : "border-gray-200"} cursor-pointer`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
                    <div className="font-medium">{problem?.title}</div>
                    <div className="text-center">{problem?.difficulty?.toUpperCase()}</div>
                    <div className="text-center">{problem?.tags}</div>
                  </div>
                </Link>
              </AnimatedWrapper>
            ))}

            {!(roomData?.problems?.length || localRoomData?.problems?.length) && (
              <div className={`text-center py-12 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <div className={`text-2xl mb-2 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                  No problems available
                </div>
                <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                  Check back later for new challenges
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}