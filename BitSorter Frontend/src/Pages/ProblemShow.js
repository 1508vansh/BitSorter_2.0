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
  //to re-render everything properly and remove the late response and empty array bug...
  const [filterResetKey, setFilterResetKey] = useState(0);

  //to block inview and data fetch from backend when filtering,
  //because this can cause major issue, since it will continuously
  //fetch the data from backend and pages will end...
  //i have to only fetch when the filtering is not happening...
  const [filtering, setFiltering] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3, // 30% of the element should be visible
    triggerOnce: true, // only trigger once
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
      //to get solved problems of user...
      const response = await axiosClient.get("/user/auth/getUserDetails");
      const d = response?.data;
      data?.problems?.forEach((obj) => {
        let exist = d?.user?.problemSolved?.some((Pid) => {
          return obj._id === Pid;
        });
        console.log("this is solved problems data : ", d);
        console.log("this is solved problems : ", d?.user?.problemSolved);
        if(exist) console.log("yes exist solved problems");
        else console.log("hasn't more!")
        if (exist) obj.solved = true;
        else obj.solved = false;
      });

      const filtered = filterProblems(data?.problems);

      // Overwrite if it's a reset (filter change), else append
      setProblemArr((prev) => {
        if (isReset) return filtered;

        const newOnes = filtered.filter(
          (p) => !prev.some((old) => old._id === p._id)
        );

        return [...prev, ...newOnes];
      });

      // Reset page correctly if filtered
      setPage(overridePage + 1);

      // Only set hasMore false if less than expected (e.g. less than 6 results)
      setHasMore(data.problems.length >= 6);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(problemArr);
  // Call fetch when user scrolls to the ref
  useEffect(() => {
    if (inView && !loading && hasMore && !filtering) {
      fetchProblems();
    }
  }, [inView, loading, hasMore, filtering]);

  //function to filter the problems...
  const filterProblems = (arr) => {
    const newProblemArr = arr.filter((problem) => {
      const tagBoolean = tagState === "All" || tagState === problem?.tags;
      const difficultyBoolean =
        difficultyState === "All" ||
        difficultyState.toLowerCase() === problem?.difficulty;
      const statusBoolean =
        statusState === "All" ||
        (statusState === "solved" ? problem?.solved : !problem?.solved);
      // Have to apply Status filter also...
      return tagBoolean && difficultyBoolean && statusBoolean;
    });
    return newProblemArr;
  };

  useEffect(() => {
    setFiltering(true); // Block inView fetching temporarily
    setProblemArr([]);
    setPage(1);
    setHasMore(true);

    // Trigger fetch manually and re-enable inView fetch after
    fetchProblems(1, true).then(() => {
      setFiltering(false); // Allow inView to fetch again
    });
  }, [tagState, difficultyState, statusState]);

  useEffect(() => {
    fetchProblems(1, true); // fetch from page 1, isReset = true
  }, [filterResetKey]);

  //for filtering elements : whether problems are solved or not...

  return (
    <>
      <AnimatedWrapper>
        <div className={`${isDark ? "bg-gray-900" : ""} h-screen`}>
          <section className={`${isDark ? "bg-gray-900" : ""} pt-3`}>
            <div className="flex justify-center">
              <div
                className={`${
                  isDark ? "text-white" : ""
                } badge badge-neutral mt-2 badge-dash p-5 text-4xl`}
              >
                Problem Set
              </div>
            </div>
            <div className="py-4">
              <div
                className={`${
                  isDark ? "text-white" : ""
                } grid grid-rows-1 grid-cols-3 pt-5 pb-3`}
              >
                <div className="flex justify-center font-extralight">
                  Difficulty
                </div>
                <div className="flex justify-center font-extralight">Type</div>
                <div className="flex justify-center font-extralight">
                  Topic Tags
                </div>
              </div>
              <div className="grid grid-rows-1 grid-cols-3 py-3">
                {/*dropdown For difficulty */}
                <div className="flex justify-center">
                  <Dropdown
                    className={"flex justify-center"}
                    arr={difficulty}
                    isOpen={difficultyOpen}
                    setIsOpen={setDifficultyOpen}
                    state={difficultyState}
                    setState={setDifficultyState}
                  />
                </div>
                {/*dropdown For status */}
                <div className="flex justify-center">
                  <Dropdown
                    arr={status}
                    isOpen={statusOpen}
                    setIsOpen={setStatusOpen}
                    state={statusState}
                    setState={setStatusState}
                  />
                </div>
                {/*dropdown For tags */}
                <div className="flex justify-center">
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
            <div className="border border-gray-300 rounded-sm p-4">
              <div className="flex flex-col rounded-sm mx-1">
                <AnimatedWrapper>
                  {problemArr?.map((problem, index) => {
                    return (
                      <AnimatedWrapper key={index}>
                        <Link
                          to={`/problem/${problem._id}`}
                          key={problem._id}
                          className={`grid grid-rows-1 grid-cols-3 items-center border-t ${
                            isDark ? "border-gray-900" : "border-gray-100"
                          } rounded-sm ${
                            problem?.solved
                              ? ("bg-green-400"||'bg-success')
                              : isDark
                              ? index % 2 === 0
                                ? "bg-gray-800"
                                : "bg-black"
                              : index % 2 === 0
                              ? "bg-gray-50"
                              : "bg-white"
                          }  h-10 w-full hover:bg-gray-100 
                px-2 py-1 rounded-xl`}
                        >
                          <div
                            className={`flex justify-center font-light ${
                              isDark ? "text-white" : ""
                            } sm:text-base text-xs`}
                          >{`${index + 1}. ${problem?.title}`}</div>
                          <div className="flex justify-center">
                            <span
                              className={`mr-3 badge font-semibold ${
                                problem?.difficulty == "medium"
                                  ? "badge-outline text-yellow-700"
                                  : problem?.difficulty == "easy"
                                  ? "badge-outline text-green-700"
                                  : problem?.difficulty == "beginner"
                                  ? "badge-outline text-blue-700"
                                  : "text-error"
                              }
                   sm:text-base text-xs sm:px-5`}
                            >
                              {problem?.difficulty}
                            </span>
                          </div>
                          <div className="flex justify-center">
                            <span className="sm:text-base text-xs badge badge-soft badge-warning">
                              {problem?.tags}
                            </span>
                          </div>
                        </Link>
                      </AnimatedWrapper>
                    );
                  })}
                </AnimatedWrapper>
              </div>
            </div>
          </section>
          <div
            ref={ref}
            className={`${
              isDark ? "bg-gray-900" : ""
            } h-10 flex justify-center items-center`}
          >
            {loading && <span>Loading more...</span>}
          </div>
        </div>
      </AnimatedWrapper>
    </>
  );
}
