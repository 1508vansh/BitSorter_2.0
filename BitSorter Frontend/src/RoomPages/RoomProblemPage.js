import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { ResultView, TestCaseView } from "../components/editorViews";
import {updatePlayers,deletePlayer,clearRoom, setRoomHasEnded, setRoomData} from '../slices/roomSlice';
import { useDispatch } from "react-redux";
import {
  ProblemDescriptionWindow,
  EditorialWindow,
  SubmissionsWindow,
  SolutionWindow,
} from "../components/frontWindowElements";
import ChatAiWindow from "../components/chatAiWindow";
import { useSelector } from "react-redux";
import socket from '../Connections/socket';
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import { useNavigate } from "react-router";

export default function RoomProblemPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: problemId } = useParams();
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(false);
  const [frontWindow, setFrontWindow] = useState("description");
  const [languageSelected, setLanguageSelected] = useState("c++");
  const [editorView, setEditorView] = useState("code");
  const [runData, setRunData] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  const [editorCode, setEditorCode] = useState("");
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const roomData = useSelector((state) => state?.room?.roomData);
  const [roomDataLocal, setRoomDataLocal] = useState(() => 
    JSON.parse(localStorage.getItem("RoomData")) || {}
  );
  const [winner, setWinner] = useState(null);

  const initialCode = {
    "c++":
      problem["startCode"]?.find(
        (obj) => obj.language === "c++" || obj.language === "cpp"
      )?.initialCode || "",
    "java":
      problem["startCode"]?.find((obj) => obj.language === "java")
        ?.initialCode || "",
    "javascript":
      problem["startCode"]?.find(
        (obj) => obj.language === "javascript" || obj.language === "js"
      )?.initialCode || "",
  };

  // Restore room state on component mount
  useEffect(() => {
    const restoreRoomState = () => {
      try {
        const rd = JSON.parse(localStorage.getItem("RoomData"));
        const pid = localStorage.getItem("playerId");
        const roomId = rd?.roomId;
        
        if (rd && pid && roomId) {
          socket.emit("getRoomState", { roomId }, (response) => {
            if (response?.ok && response?.room) {
              const freshRoomData = response.room;
              const isUserInRoom = freshRoomData.players.some(player => 
                player.playerId === pid
              );
              
              if (isUserInRoom) {
                dispatch(setRoomData(freshRoomData));
                setRoomDataLocal(freshRoomData);
                localStorage.setItem("RoomData", JSON.stringify(freshRoomData));
                
                if (freshRoomData.endTime && Date.now() > freshRoomData.endTime) {
                  dispatch(setRoomHasEnded(true));
                }
              } else {
                // User not in room, redirect
                dispatch(clearRoom());
                localStorage.removeItem("RoomData");
                localStorage.removeItem("playerId");
                navigate('/Arena');
              }
            } else {
              // Room doesn't exist, redirect
              dispatch(clearRoom());
              localStorage.removeItem("RoomData");
              localStorage.removeItem("playerId");
              navigate('/Arena');
            }
          });
        } else {
          navigate('/Arena');
        }
      } catch (err) {
        console.error("Error restoring room state:", err);
        navigate('/Arena');
      }
    };

    restoreRoomState();
  }, [dispatch, navigate]);

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
              setRoomDataLocal(freshRoomData);
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
    (async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/getProblem/${problemId}`
        );
        setProblem(response.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching problem details. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [problemId]);

  useEffect(() => {
    setEditorCode(initialCode[languageSelected]);
  }, [languageSelected, problem]);

  const handleRun = async () => {
    if (loading) return;
    setLoading(true);
    setEditorView("result");
    try {
      const response = await axiosClient.post(
        `/submitProblem/run/${problemId}`,
        { code: editorCode, language: languageSelected }
      );
      setRunData(response.data);
    } catch (err) {
      console.error(err);
      alert("Error running code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setEditorView("testcase");
    try {
      const roomId = roomData?.roomId || roomDataLocal?.roomId;
      console.log("this is roomid in the frontend room problem page : ", roomId);
      socket.emit('submitSolution',{code:editorCode,language:languageSelected,problemId,roomId},(response)=>{
          if(response?.ok){
            setSubmitData(response);
            console.log("this is judge result in fronted", response);
          }else{
            alert(response?.error || "Error try again later!");
          }
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        id: player.playerId,
        username: player.username,
        score: simpleScore(player.solved, player.totalTimeMs),
        timeMs: player.totalTimeMs,
        problemsSolved: player.solved,
      }));
      dispatch(updatePlayers(updatedPlayers));
      // persist players into RoomData so other returning users see updated scoreboard
      try {
        const rd = JSON.parse(localStorage.getItem("RoomData")) || {};
        rd.players = updatedPlayers;
        localStorage.setItem("RoomData", JSON.stringify(rd));
        setRoomDataLocal(rd);
      } catch (err) {
        console.warn("Failed to persist RoomData from RoomProblemPage", err);
      }
    };

    const endCompetition = (standings) => {
      console.log("Competition ended. Final standings:", standings);
      // The winner is the first player in the final standings array
      if (standings && standings.length > 0) {
        const winnerPlayer = standings[0];
        setWinner(winnerPlayer.playerId); // Set winner by persistent playerId
        // Also update the store with the final player states
        handleScoreboardUpdate(standings);
        dispatch(setRoomHasEnded(true));
      }
    };

    const onPlayerLeft = (data) => {
      dispatch(deletePlayer(data?.socketId));
      // Update local storage if current user left
      if (data.playerId === localStorage.getItem("playerId")) {
        localStorage.removeItem("playerId");
        localStorage.removeItem("RoomData");
        dispatch(setRoomHasEnded(true));
      }
    };

    socket.on("updateScoreboard", handleScoreboardUpdate);
    socket.on("updatePlayers", handleScoreboardUpdate);
    socket.on("playerLeft", onPlayerLeft);
    socket.on("endCompetition", endCompetition);


    return () => {
      socket.off("updateScoreboard", handleScoreboardUpdate);
      socket.off("updatePlayers", handleScoreboardUpdate);
      socket.off("endCompetition", endCompetition);
      socket.off("playerLeft", onPlayerLeft);
    };
  }, [dispatch]);

  return (
    <AnimatedWrapper>
    <div className="flex flex-col sm:flex-row w-screen border h-auto sm:h-[calc(100vh-85px)] overflow-auto sm:overflow-hidden">
      {/* Left panel */}
      <div className="sm:w-1/2 w-full flex flex-col border-x gap-1 overflow-hidden">
        {/* Top navigation tabs (Description, Editorial, etc.) */}
        <div className="flex sm:justify-normal justify-center items-center flex-wrap gap-2 p-2 shrink-0">
          {[
            "description",
            "editorial",
            "submissions",
          ].map((window) => (
            <button
              key={window}
              onClick={() => setFrontWindow(window)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
        ${
          frontWindow === window
            ? "bg-indigo-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
            >
              {window.charAt(0).toUpperCase() + window.slice(1)}
            </button>
          ))}
        </div>

        <hr className="shrink-0" />
        <div className={`p-3 ${isDark?'bg-gray-900':''} flex-1 overflow-y-auto`}>
          {frontWindow === "description" ? (
            <ProblemDescriptionWindow problem={problem} />
          ) : frontWindow === "editorial" ? (
            <EditorialWindow />
          ) : frontWindow === "submissions" ? (
            <SubmissionsWindow problemId={problemId} />
          ) : (
            <ChatAiWindow problem={problem} />
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="sm:w-1/2 w-full flex flex-col gap-1 overflow-hidden">
        <div className="flex justify-between p-2 shrink-0">
          {/* Editor view buttons (Code, Testcase, Result) */}
          <div className="flex gap-2">
            {["code", "testcase", "result"].map((view) => (
              <button
                key={view}
                onClick={() => setEditorView(view)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
        ${
          editorView === view
            ? "bg-purple-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          {/* Run & Submit buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={loading}
              className="px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-green-500 hover:bg-green-600 active:scale-95 transition disabled:opacity-50"
            >
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
        <hr className="shrink-0" />
        <div className="flex gap-2 p-2 shrink-0">
          {["c++", "java", "javascript"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguageSelected(lang)}
              className={`rounded-sm border font-semibold py-0.5 px-1.5 ${
                languageSelected === lang ? "bg-gray-200" : ""
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="sm:flex-1 flex flex-col sm:h-full h-[400px] overflow-auto">
          {editorView === "code" ? (
            <Editor
              height="100%"
              theme="vs-dark"
              language={languageSelected === "c++" ? "cpp" : languageSelected}
              value={editorCode}
              onChange={(value) => setEditorCode(value)}
              onMount={(editor) => editor.focus()}
            />
          ) : editorView === "testcase" ? (
            <TestCaseView submitData={submitData} />
          ) : (
            <ResultView runData={runData} />
          )}
        </div>
      </div>
    </div>
    </AnimatedWrapper>
  );
}
