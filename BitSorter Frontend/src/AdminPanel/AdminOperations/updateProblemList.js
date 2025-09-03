import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";

import axiosClient from "../../utils/axiosClient";
export default function updateProblemList() {
  const [page, setPage] = useState(1);
  const [problemArr, setProblemArr] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0, // trigger as soon as it's visible
  });

  //function to fetch the problems.....
  const fetchProblems = async (overridePage = page) => {
    if (loading || (!hasMore && !isReset)) return;

    setLoading(true);

    try {
      const res = await axiosClient.get(
        `/problem/getAllProblems?page=${overridePage}&limit=10`
      );
      const data = res?.data;

      // Overwrite if it's a reset (filter change), else append
      setProblemArr((prev) => [...prev, ...data?.problems]);

      // Reset page correctly if filtered
      setPage(overridePage + 1);

      // Only set hasMore false if less than expected (e.g. less than 6 results)
      setHasMore(data?.problems?.length >= 10);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchProblems();
    }
  }, [inView, loading, hasMore]);

  return (
    <>
      {
        <div className={`border border-gray-300 rounded-sm p-4`}>
        <div className="flex flex-col rounded-sm mx-1">
          {problemArr?.map((problem, index) => {
            return (
              <Link
                to={`/admin/update-problem/${problem._id}`}
                key={problem._id}
                className={`grid grid-rows-1 grid-cols-3 items-center justify-between border-x 
                 rounded-sm ${
                     index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }  h-10 w-full hover:bg-gray-100 
                px-2 py-1 rounded-xl`}
              >
                <div className={`flex justify-center font-light sm:text-base text-xs`}>{`${index + 1}. ${problem?.title}`}</div>
                <div>
                  <span className={`mr-3 badge font-semibold ${
                      problem?.difficulty == "medium"
                        ? "badge-outline text-yellow-700"
                        : problem?.difficulty == "easy"
                        ? "badge-outline text-green-700"
                        : problem?.difficulty == "beginner"
                        ? "badge-outline text-blue-700"
                        : "text-error"
                    }
                   sm:text-base text-xs sm:px-5`}>
                    {problem?.difficulty}
                  </span>
                </div>
                <div>
                  <div>{problem?.tags}</div>
                </div>
              </Link>
            );
          })}
          <div ref={ref} className="h-10 flex justify-center items-center">
            {loading && <span>Loading more...</span>}
          </div>
        </div>
        </div>
      }
    </>
  );
}
