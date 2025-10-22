import { useEffect, useState } from "react";
import socket from "../Connections/socket";
import { Link } from "react-router";
import { setRoomData, deletePlayer,clearRoom } from "../slices/roomSlice";
import { useDispatch, useSelector } from "react-redux";
import AnimatedWrapper from "../Ui/AnimatedWrapper";

export default function Arena() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("host");
  const [roomId, setRoomId] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [joinedPlayer, setJoinedPlayer] = useState(false);
  const [joinedPlayerMessage, setJoinedPlayerMessage] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [roomHasEnded, setRoomHasEnded] = useState(false);

  const AlreadyInRoom = useSelector((state) =>
    state?.room?.roomData?.players?.some(
      (player) => player.id === localStorage.getItem("playerId")
    )
  );

  //calculate score based on solved problems and total time taken...
  function simpleScore(problemsSolved, totalTimeMs) {
    const base = problemsSolved * 100;
    const timeBonus = Math.max(0, 100 - totalTimeMs / 60000);
    return Math.round(base + timeBonus);
  }

  const CreateRoom = () => {
    if (roomId) return;
    console.log("CreateRoom is called!");
    socket.emit(
      "createRoom",
      { durationMs: 60 * 10 * 1000, username: userName },
      (res) => {
        console.log("Is being created!");
        if (res?.ok) {
          console.log("room is created room id is : ", res?.roomId);
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

  // On mount, restore RoomData if this browser/session has the same persistent playerId
  useEffect(() => {
    try {
      const rd = JSON.parse(localStorage.getItem("RoomData"));
      const pid = localStorage.getItem("playerId");
      if (rd && pid && Array.isArray(rd.players)) {
        const found = rd.players.some((p) => (p.playerId || p.id) === pid || p.id === pid);
        if (found) {
          setHasStarted(Boolean(rd.startTime));
          dispatch(setRoomData(rd));
        } else {
          // stale data; don't auto-join
          // optionally clear stale RoomData
          // localStorage.removeItem('RoomData');
        }
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [dispatch]);

  useEffect(() => {
    const onNewPlayer = (data) => {
      if (data?.ok) {
        setJoinedPlayer(true);
        setJoinedPlayerMessage(`${data?.username} has joined the arena!`);
      }
    };
    const onStartCompetition = (data) => {
      setHasStarted(true);

      const updatedPlayers = data?.players?.map((player) => ({
        ...player, // Keep all player data from backend
        playerId: player?.playerId, // Ensure the main id is the persistent one
        score: 0,
        timeMs: player?.totalTimeMs,
        problemsSolved: player?.solved,
      }));
      const newData = { ...data, players: updatedPlayers };
      dispatch(setRoomData(newData));
      localStorage.setItem("RoomData", JSON.stringify(data));
    };
    const onPlayerLeft = (data) => {
      dispatch(deletePlayer(data?.socketId));
      localStorage.removeItem("playerId");
      localStorage.removeItem("RoomData");
      setHasStarted(false);
      setRoomHasEnded(true);
    };
    const endCompetition = (standings) => {
      console.log("Competition ended. Final standings:", standings);
      // The winner is the first player in the final standings array
      if (standings && standings.length > 0) {
        const winnerPlayer = standings[0];
        setWinner(winnerPlayer.playerId); // Set winner by persistent playerId
        // Also update the store with the final player states
        handleScoreboardUpdate(standings);
        dispatch(clearRoom());
        setRoomHasEnded(true);
        setHasStarted(false);
      }
    };

    socket.on("new_player_join_message", onNewPlayer);
    socket.on("startCompetition", onStartCompetition);
    socket.on("playerLeft", onPlayerLeft);
    socket.on("endCompetition", endCompetition);

    return () => {
      socket.off("new_player_join_message", onNewPlayer);
      socket.off("startCompetition", onStartCompetition);
      socket.off("playerLeft", onPlayerLeft);
      socket.off("endCompetition", endCompetition);
    };
  }, [dispatch]);

  return (
    <AnimatedWrapper>
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-block px-4 py-2 rounded-lg mb-4 ${
              isDark ? "bg-blue-600" : "bg-blue-500"
            } text-white font-semibold`}
          >
            1V1 CODE DUEL
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to the Arena</h1>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Challenge other coders in real-time programming battles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          {/* Create Room Button */}
          <button
            onClick={() => document.getElementById("create_modal").showModal()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
              isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Create Room
          </button>

          {/* Join Room Button */}
          <button
            onClick={() => document.getElementById("join_modal").showModal()}
            className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Join Room
          </button>

          {/* Enter Arena Button */}
          {((hasStarted || AlreadyInRoom) && !roomHasEnded) && (
            <Link
              to={"/RoomProblemSection"}
              className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
            >
              Enter Arena
            </Link>
          )}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Create Battle</h3>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Start a new coding challenge and share the room code with your
              opponent
            </p>
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Join Battle</h3>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Enter a room code to join an existing coding challenge
            </p>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      <dialog id="create_modal" className="modal">
        <div
          className={`modal-box max-w-md ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h3 className="font-bold text-xl mb-4">Create Coding Room</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <button
              onClick={CreateRoom}
              disabled={!userName.trim()}
              className={`w-full py-3 rounded-lg font-semibold ${
                !userName.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              Create Room
            </button>

            {roomId && (
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-green-500"
                    : "bg-green-50 border-green-400"
                }`}
              >
                <p className="font-semibold text-green-600 mb-1">
                  Room Created!
                </p>
                <p
                  className={`font-mono text-lg ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {roomId}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Share this code with your opponent
                </p>
              </div>
            )}

            {joinedPlayer ? (
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-green-900 border-green-600"
                    : "bg-green-100 border-green-400"
                }`}
              >
                <p className="text-green-600 font-medium text-center">
                  {joinedPlayerMessage}
                </p>
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-blue-900 border-blue-600"
                    : "bg-blue-100 border-blue-400"
                }`}
              >
                <p className="text-blue-600 text-center">
                  Waiting for opponent to join...
                </p>
              </div>
            )}

            <button
              className={`w-full py-3 rounded-lg font-semibold ${
                !joinedPlayer || hasStarted
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white`}
              disabled={!joinedPlayer || hasStarted}
              onClick={StartTheArena}
            >
              Start Competition
            </button>

            {(hasStarted || AlreadyInRoom) && (
              <Link
                to={"/RoomProblemSection"}
                className={`block w-full py-3 text-center rounded-lg font-semibold ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                Enter Competition
              </Link>
            )}
          </div>

          <div className="modal-action mt-6">
            <form method="dialog">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Join Room Modal */}
      <dialog id="join_modal" className="modal">
        <div
          className={`modal-box max-w-md ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h3 className="font-bold text-xl mb-4">Join Coding Room</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Room Code
              </label>
              <input
                onChange={(e) => setJoinRoomId(e.target.value)}
                type="text"
                placeholder="Enter room code"
                className={`w-full px-3 py-2 rounded-lg border font-mono ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <button
              onClick={JoinTheRoom}
              disabled={joined || !userName.trim() || !joinRoomId.trim()}
              className={`w-full py-3 rounded-lg font-semibold ${
                joined || !userName.trim() || !joinRoomId.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {joined ? "Joined Successfully!" : "Join Room"}
            </button>

            {(hasStarted || AlreadyInRoom) && (
              <Link
                to={"/RoomProblemSection"}
                className={`block w-full py-3 text-center rounded-lg font-semibold ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                Enter Competition
              </Link>
            )}
          </div>

          <div className="modal-action mt-6">
            <form method="dialog">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
    </AnimatedWrapper>
  );
}
