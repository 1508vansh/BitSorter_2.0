import socket from "../Connections/socket";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import { updatePlayers,deletePlayer,clearRoom } from "../slices/roomSlice";

// ScoreCard Component
// MultiPlayer ScoreCard Component
function MultiPlayerScoreCard({
  winner,
  players,
  totalProblems,
  isDark,
  currentUserId,
}) {
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Sort players by score (descending) and then by time (ascending)
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
      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20
           ${isDark ? "bg-purple-500" : "bg-blue-400"}`}
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
              className={`border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <th
                className={`text-left py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Rank
              </th>
              <th
                className={`text-left py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Player
              </th>
              <th
                className={`text-center py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Score
              </th>
              <th
                className={`text-center py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Time
              </th>
              <th
                className={`text-center py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Solved
              </th>
              <th
                className={`text-center py-3 px-4 font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const progressPercentage =
                totalProblems > 0
                  ? (player.problemsSolved / totalProblems) * 100
                  : 0;
              const isCurrentUser = player.id === currentUserId;
              const isWinner = player.id === winner;

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
                      ? `border-b ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {index === 0 && (
                        <span className="text-yellow-500 text-lg mr-2">
                          {isWinner ? "🏆" : "🥇"}
                        </span>
                      )}
                      {index === 1 && (
                        <span className="text-gray-400 text-lg mr-2">🥈</span>
                      )}
                      {index === 2 && (
                        <span className="text-orange-500 text-lg mr-2">🥉</span>
                      )}
                      {index > 2 && (
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-sm mr-2 ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Player Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mr-3 ${
                          isCurrentUser
                            ? "bg-blue-500 text-white"
                            : isDark
                            ? "bg-purple-500 text-white"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {player.username?.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-800"
                        } ${isCurrentUser ? "font-bold" : ""}`}
                      >
                        {player.username}
                        {isCurrentUser && !isWinner && (
                          <span
                            className={`ml-2 text-xs ${
                              isDark ? "text-blue-300" : "text-blue-600"
                            }`}
                          >
                            (You)
                          </span>
                        )}
                        {isWinner && (
                          <span
                            className={`ml-2 text-xs font-bold ${
                              isDark ? "text-green-300" : "text-green-600"
                            }`}
                          >
                            (Winner!)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold text-lg ${
                        isDark ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      {player.score}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono font-semibold ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {formatTime(player.timeMs)}
                    </span>
                  </td>

                  {/* Problems Solved */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {player.problemsSolved}
                      <span className="text-sm">/{totalProblems}</span>
                    </span>
                  </td>

                  {/* Progress Bar */}
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
                      <span
                        className={`text-xs w-12 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
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

      {/* Legend */}
      <div
        className={`mt-4 text-xs flex flex-wrap gap-4 justify-center ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
          <span>Current Player</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
          <span>All Problems Solved</span>
        </div>
        {winner && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500/50 rounded mr-1"></div>
            <span>Winner</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomProblemSection() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [RoomData, setRoomData] = useState(
    JSON.parse(localStorage.getItem("RoomData"))
  );
  const [winner, setWinner] = useState(null);
  const players = useSelector((state) => state?.room?.roomData?.players) || [];
  const dispatch = useDispatch();
  const [tickTime, setTickTime] = useState(0);
  const [roomHasEnded, setRoomHasEnded] = useState(false);

  //calculate score based on solved problems and total time taken...
  function simpleScore(problemsSolved, totalTimeMs) {
    const base = problemsSolved * 100;
    const timeBonus = Math.max(0, 100 - totalTimeMs / 60000);
    return Math.round(base + timeBonus);
  }

  // Listen for score updates via socket
  useEffect(() => {
    const handleScoreboardUpdate = (data) => {
      console.log("Received score update:", data);
      const updatedPlayers = data?.map((player) => ({
        ...player, // Keep all player data from backend
        id: player.playerId, // Ensure the main id is the persistent one
        score: simpleScore(player.solved, player.totalTimeMs),
        timeMs: player.totalTimeMs,
        problemsSolved: player.solved,
      }));
      dispatch(updatePlayers(updatedPlayers));
    };

    const endCompetition = (standings) => {
      console.log("Competition ended. Final standings:", standings);
      // The winner is the first player in the final standings array
      if (standings && standings.length > 0) {
        const winnerPlayer = standings[0];
        setWinner(winnerPlayer.playerId); // Set winner by persistent playerId
        // Also update the store with the final player states
        handleScoreboardUpdate(standings);
        setRoomHasEnded(true);
      }
    };

    const onPlayerLeft = (data) => {
      dispatch(deletePlayer(data?.socketId));
      localStorage.removeItem("playerId");
      localStorage.removeItem("RoomData");
      setRoomHasEnded(true);
    };

    socket.on("updateScoreboard", handleScoreboardUpdate);
    socket.on("updatePlayers", handleScoreboardUpdate);
    socket.on("playerLeft", onPlayerLeft);
    socket.on("tick", (data) => {
      setTickTime(data.time);
    });

    socket.on("endCompetition", endCompetition);
    return () => {
      socket.off("updateScoreboard", handleScoreboardUpdate);
      socket.off("updatePlayers", handleScoreboardUpdate);
      socket.off("endCompetition", endCompetition);
      socket.off("playerLeft", onPlayerLeft);
      socket.off("tick");
    };
  }, [dispatch]);

  return (
    <AnimatedWrapper>
      <div
        className={`min-h-screen p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Score Card */}
          <MultiPlayerScoreCard
            winner={winner}
            players={players}
            totalProblems={RoomData?.problems?.length || 0}
            isDark={isDark}
            currentUserId={localStorage.getItem("playerId")}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className={`text-4xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Welcome to the Arena!
            </h1>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Solve problems and climb the leaderboard
            </p>
          </div>

          {/* Problems List */}
          <div
            className={`rounded-2xl shadow-lg overflow-hidden ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Table Header */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Problem
              </div>
              <div
                className={`font-semibold text-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Difficulty
              </div>
              <div
                className={`font-semibold text-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Tags
              </div>
            </div>

            {/* Problems */}
            {RoomData?.problems?.map((problem, index) => {
              return (
                <AnimatedWrapper key={index}>
                  <Link
                    to={winner ? "#" : `/RoomProblem/${problem._id}`}
                    key={problem._id}
                    className={`block transition-all duration-300 hover:transform hover:scale-[1.02] ${
                      isDark
                        ? winner
                          ? "opacity-50 bg-gray-200"
                          : problem?.solved
                          ? "bg-green-300 hover:bg-green-500"
                          : index % 2 === 0
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-gray-900 hover:bg-gray-700"
                        : winner
                        ? "opacity-50 bg-gray-200"
                        : problem?.solved
                        ? "bg-green-100 hover:bg-green-200"
                        : index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-100"
                    } border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
                      {/* Problem Title */}
                      <div className="flex items-center space-x-3">
                        {problem?.solved && (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isDark ? "bg-green-400" : "bg-green-500"
                            }`}
                          ></div>
                        )}
                        <div
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-800"
                          } sm:text-base text-sm`}
                        >
                          {`${index + 1}. ${problem?.title}`}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm border-2 ${
                            problem?.difficulty === "medium"
                              ? isDark
                                ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                                : "border-yellow-400 text-yellow-700 bg-yellow-50"
                              : problem?.difficulty === "easy"
                              ? isDark
                                ? "border-green-500 text-green-400 bg-green-500/10"
                                : "border-green-400 text-green-700 bg-green-50"
                              : problem?.difficulty === "beginner"
                              ? isDark
                                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                                : "border-blue-400 text-blue-700 bg-blue-50"
                              : isDark
                              ? "border-red-500 text-red-400 bg-red-500/10"
                              : "border-red-400 text-red-700 bg-red-50"
                          }`}
                        >
                          {problem?.difficulty?.toUpperCase()}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDark
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-purple-100 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {problem?.tags}
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedWrapper>
              );
            })}
          </div>

          {/* Empty State */}
          {(!RoomData?.problems || RoomData.problems.length === 0) && (
            <div
              className={`text-center py-12 rounded-2xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`text-2xl mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                No problems available
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Check back later for new challenges
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
}
