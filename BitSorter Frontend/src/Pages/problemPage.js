import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { ResultView, TestCaseView } from "../components/editorViews";
import {
  ProblemDescriptionWindow,
  EditorialWindow,
  SubmissionsWindow,
  SolutionWindow,
} from "../components/frontWindowElements";
import ChatAiWindow from "../components/chatAiWindow";
import { useSelector } from "react-redux";

export default function ProblemPage() {
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
      const response = await axiosClient.post(
        `/submitProblem/submit/${problemId}`,
        { code: editorCode, language: languageSelected }
      );
      setSubmitData(response.data);
    } catch (err) {
      console.error(err);
      alert("Error submitting code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-screen border h-auto sm:h-[calc(100vh-85px)] overflow-auto sm:overflow-hidden">
      {/* Left panel */}
      <div className="sm:w-1/2 w-full flex flex-col border-x gap-1 overflow-hidden">
        {/* Top navigation tabs (Description, Editorial, etc.) */}
        <div className="flex sm:justify-normal justify-center items-center flex-wrap gap-2 p-2 shrink-0">
          {[
            "description",
            "editorial",
            "solution",
            "submissions",
            "ChatAI",
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
          ) : frontWindow === "solution" ? (
            <SolutionWindow problem={problem} />
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
  );
}
0