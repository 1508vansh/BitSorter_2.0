import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import axiosClient from "../utils/axiosClient";
import Dropdown from "../utils/dropdown";
import { Link, useParams } from "react-router";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import { useSelector } from "react-redux";

export default function ProblemShow() {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [page, setPage] = useState(1);
  const [problemArr, setProblemArr] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [difficultyState, setDifficultyState] = useState("All");
  const [statusState, setStatusState] = useState("All");
  const [tagState, setTagState] = useState("All");
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [filtering, setFiltering] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const tags = [
    "All",
    "Arrays",
    "String",
    "LinkedList",
    "Sorting",
    "Graph",
    "DP",
    "Recursion",
    "Tree",
  ];
  const difficulty = ["All", "Beginner", "Easy", "Medium"];
  const status = ["All", "solved", "unsolved"];

  const fetchProblems = async (overridePage = page, isReset = false) => {
    if (loading || (!hasMore && !isReset)) return;

    setLoading(true);

    try {
      const res = await axiosClient.get(
        `/problem/getAllProblems?page=${overridePage}&limit=6`
      );
      const data = res.data;
      const response = await axiosClient.get("/user/auth/getUserDetails");
      const d = response?.data;
      data?.problems?.forEach((obj) => {
        let exist = d?.user?.problemSolved?.some((Pid) => {
          return obj._id === Pid;
        });
        if (exist) obj.solved = true;
        else obj.solved = false;
      });

      const filtered = filterProblems(data?.problems);

      setProblemArr((prev) => {
        if (isReset) return filtered;

        const newOnes = filtered.filter(
          (p) => !prev.some((old) => old._id === p._id)
        );

        return [...prev, ...newOnes];
      });

      setPage(overridePage + 1);
      setHasMore(data.problems.length >= 6);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(problemArr);

  useEffect(() => {
    if (inView && !loading && hasMore && !filtering) {
      fetchProblems();
    }
  }, [inView, loading, hasMore, filtering]);

  const filterProblems = (arr) => {
    const newProblemArr = arr.filter((problem) => {
      const tagBoolean = tagState === "All" || tagState === problem?.tags;
      const difficultyBoolean =
        difficultyState === "All" ||
        difficultyState.toLowerCase() === problem?.difficulty;
      const statusBoolean =
        statusState === "All" ||
        (statusState === "solved" ? problem?.solved : !problem?.solved);
      return tagBoolean && difficultyBoolean && statusBoolean;
    });
    return newProblemArr;
  };

  useEffect(() => {
    setFiltering(true);
    setProblemArr([]);
    setPage(1);
    setHasMore(true);

    fetchProblems(1, true).then(() => {
      setFiltering(false);
    });
  }, [tagState, difficultyState, statusState]);

  useEffect(() => {
    fetchProblems(1, true);
  }, [filterResetKey]);

  return (
    <>
      <AnimatedWrapper>
        <div className={`${isDark ? "bg-gray-900" : "bg-white"} min-h-screen py-6 px-4 sm:px-6 lg:px-8`}>
          {/* Header Section */}
          <section className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                Problem Set
              </h1>
              <p className={`text-sm sm:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Practice coding problems to improve your skills
              </p>
            </div>

            {/* Filter Section */}
            <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6 mb-8 border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex justify-between items-center gap-4 md:gap-6">
                {/* Difficulty Filter */}
                <div className="space-y-2 text-center">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Difficulty
                  </label>
                  <Dropdown
                    arr={difficulty}
                    isOpen={difficultyOpen}
                    setIsOpen={setDifficultyOpen}
                    state={difficultyState}
                    setState={setDifficultyState}
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2 text-center">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Status
                  </label>
                  <Dropdown
                    arr={status}
                    isOpen={statusOpen}
                    setIsOpen={setStatusOpen}
                    state={statusState}
                    setState={setStatusState}
                  />
                </div>

                {/* Tags Filter */}
                <div className="space-y-2 text-center">
                  <label className={`block text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} mb-2`}>
                    Topic Tags
                  </label>
                  <Dropdown
                    arr={tags}
                    isOpen={tagOpen}
                    setIsOpen={setTagOpen}
                    state={tagState}
                    setState={setTagState}
                  />
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg border ${isDark ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
              {/* Table Headers - Hidden on mobile */}
              <div className={`hidden sm:grid sm:grid-cols-12 ${isDark ? "bg-gray-700" : "bg-gray-50"} px-4 py-3 border-b ${isDark ? "border-gray-600" : "border-gray-200"}`}>
                <div className="col-span-6">
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Problem
                  </span>
                </div>
                <div className="col-span-3 text-center">
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Difficulty
                  </span>
                </div>
                <div className="col-span-3 text-center">
                  <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Topic
                  </span>
                </div>
              </div>

              {/* Problems */}
              <AnimatedWrapper>
                <div className={`divide-y ${isDark ? "divide-gray-600" : "divide-gray-200"}`}>
                  {problemArr?.map((problem, index) => (
                    <AnimatedWrapper key={problem._id}>
                      <Link
                        to={`/problem/${problem._id}`}
                        className={`block transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                          problem?.solved
                            ? `${isDark ? "bg-green-900/20" : "bg-green-50"} border-l-4 border-green-500`
                            : isDark
                            ? index % 2 === 0
                              ? "bg-gray-800"
                              : "bg-gray-800/50"
                            : index % 2 === 0
                            ? "bg-gray-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-4 py-4 sm:py-3 items-center">
                          {/* Problem Title - Full width on mobile, 6 cols on desktop */}
                          <div className="col-span-1 sm:col-span-6 flex items-center space-x-3">
                            <div className={`text-sm sm:text-base font-medium ${isDark ? "text-white" : "text-gray-900"} flex items-center space-x-2`}>
                              <span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                {index + 1}.
                              </span>
                              <span>{problem?.title}</span>
                              {problem?.solved && (
                                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-100"}`}>
                                  Solved
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Difficulty - Stacked on mobile, 3 cols on desktop */}
                          <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              problem?.difficulty === "medium"
                                ? isDark ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                                : problem?.difficulty === "easy"
                                ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
                                : problem?.difficulty === "beginner"
                                ? isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
                                : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"
                            }`}>
                              {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
                            </span>
                          </div>

                          {/* Tags - Stacked on mobile, 3 cols on desktop */}
                          <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-800"}`}>
                              {problem?.tags}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </AnimatedWrapper>
                  ))}
                </div>
              </AnimatedWrapper>

              {/* Empty State */}
              {problemArr.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className={`text-6xl mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>📝</div>
                  <h3 className={`text-lg font-medium ${isDark ? "text-gray-200" : "text-gray-900"} mb-2`}>
                    No problems found
                  </h3>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>

            {/* Loading Indicator */}
            <div
              ref={ref}
              className="flex justify-center items-center py-8"
            >
              {loading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Loading more problems...
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </AnimatedWrapper>
    </>
  );
}