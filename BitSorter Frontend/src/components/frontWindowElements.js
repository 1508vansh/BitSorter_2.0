import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import CodeBlock from "../Ui/copyBlock";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";

//problem description window...
const ProblemDescriptionWindow = ({ problem }) => {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [solved, setSolved] = useState(false);
  console.log(problem?._id);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosClient.get("/user/auth/getUserDetails");
        const data = response?.data;
        const isSolved = data?.problemSolved?.some((Pid) => {
          return Pid === problem?._id;
        });
        setSolved(isSolved);
      } catch (err) {
        console.err("Error Occured!");
      }
    };
    getData();
  }, [problem]);

  const difficultyColor = {
    beginner: "text-blue-500",
    easy: "text-green-500",
    medium: "text-orange-500",
    hard: "text-red-500",
  };
  return (
    <>
      <div className={`flex ${isDark?'bg-gray-900':''} flex-col gap-1`}>
        <div className={`flex ${isDark?'text-white':''} justify-between items-center`}>
          <div>
            <h1 className={`font-semibold ${isDark?'text-white':''} sm:text-2xl text-2xl`}>
              <span className={`pr-2 ${isDark?'text-white':''} relative text-xs bottom-1`}>
                {<FaStar className="inline" />}
              </span>
              {problem?.title}
            </h1>
          </div>
          <div className={`font-semibold ${isDark?'text-white':''} ${solved ? "text-success" : ""}`}>
            {solved ? (
              <div className="badge badge-success">
                Solved
              </div>
            ) : (
              "Unsolved"
            )}
          </div>
        </div>
        <div className={`fle ${isDark?'text-white':''} justify-start gap-1`}>
          <div>
            <p className={`${difficultyColor[problem?.difficulty]} ${isDark?'text-white':''} font-bold`}>
              {problem?.difficulty?.toUpperCase()}
            </p>
          </div>
        </div>
        <div>
          <p className={`font-medium ${isDark?'text-white':''} my-2`}>{problem?.description}</p>
        </div>
        {problem?.visibleTestCases?.length > 0 && (
          <div className={`font-semibold ${isDark?'text-white':''}`}>
            <p className="mt-4">Example 1:</p>
            <span>Input: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[0]?.input}
            </span>
            <br />
            <span>Output: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[0]?.output}
            </span>
            <br />
            <span>Explanation: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[0]?.explanation}
            </span>
          </div>
        )}
        {problem?.visibleTestCases?.length > 1 && (
          <div className={`font-semibold ${isDark?'text-white':''}`}>
            <p className="mt-4">Example 2:</p>
            <span>Input: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[1]?.input}
            </span>
            <br />
            <span>Output: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[1]?.output}
            </span>
            <br />
            <span>Explanation: </span>
            <span className="text-gray-500">
              {problem?.visibleTestCases[1]?.explanation}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

const EditorialWindow = () => {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  return (
    <>
      <div className={`${isDark?'text-white':''}`}>This Feature is currently not available</div>
    </>
  );
};

const SubmissionsWindow = ({ problemId }) => {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosClient.get(
          `/problem/getUserSubmission/${problemId}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };
    getData();
  }, [problemId]);

  return (
    <div className={`w-full bg-gray-900 ${isDark?'text-white':''} shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
      {/* Header */}
      <div className="grid grid-cols-4 bg-gray-800 px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
        <div>Status</div>
        <div>Language</div>
        <div>Runtime</div>
        <div>Memory</div>
      </div>

      {/* Submissions */}
      <div className="divide-y divide-gray-700 text-sm">
        {data.length > 0 ? (
          data
            .slice()
            .reverse()
            .map((submission) => (
              <div
                key={submission._id}
                className="grid grid-cols-4 px-4 py-2 items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* Status with color */}
                <div
                  className={`font-medium ${
                    submission.status === "Accepted"
                      ? "text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {submission.status}
                </div>

                {/* Language */}
                <div className="text-gray-600 dark:text-gray-400">
                  {submission.language || "—"}
                </div>

                {/* Runtime */}
                <div className="text-gray-600 dark:text-gray-400">
                  {Number(submission.runtime) * 1000} ms
                </div>

                {/* Memory */}
                <div className="text-gray-600 dark:text-gray-400">
                  {Number(submission.memory) / 1024} MB
                </div>
              </div>
            ))
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            No submissions yet.
          </div>
        )}
      </div>
    </div>
  );
};

const SolutionWindow = ({ problem }) => {

  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [languageSelected, setLanguageSelected] = useState("c++");

  const referenceSolution = {
    "c++":
      problem["referenceSolution"]?.find(
        (obj) => obj.language === "c++" || obj.language === "cpp"
      )?.completeCode || "",
    java:
      problem["referenceSolution"]?.find((obj) => obj.language === "java")
        ?.completeCode || "",
    javascript:
      problem["referenceSolution"]?.find(
        (obj) => obj.language === "javascript" || obj.language === "js"
      )?.completeCode || "",
  };
  //console.log("this is ref sol :",problem.referenceSolution);
  const [code, setCode] = useState(referenceSolution["c++"]);

  const set = (lang) => {
    setLanguageSelected(lang);
    setCode(referenceSolution[lang]);
  };
  return (
    <>
      {
        <div className="flex gap-2 p-2 shrink-0">
          {["c++", "java", "javascript"].map((lang) => (
            <button
              key={lang}
              onClick={() => set(lang)}
              className={`rounded-sm font-semibold py-0.5 px-1.5 ${
                languageSelected === lang
                  ? "bg-lime-600 text-white border-none"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      }
      <CodeBlock code={code} />
    </>
  );
};

export {
  ProblemDescriptionWindow,
  SolutionWindow,
  SubmissionsWindow,
  EditorialWindow,
};
