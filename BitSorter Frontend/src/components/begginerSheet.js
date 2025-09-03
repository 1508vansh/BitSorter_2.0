import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import Loader from "../Ui/Loader";

export default function BegginerSheet() {
  const [page, setPage] = useState(1);
  const [problemArr, setProblemArr] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  //to block inview and data fetch from backend when filtering,
  //because this can cause major issue, since it will continuously
  //fetch the data from backend and pages will end...
  //i have to only fetch when the filtering is not happening...
  const [filtering, setFiltering] = useState(false);

  const fetchProblems = async (overridePage = page) => {
    if (!hasMore) return;

    try {
      const res = await axiosClient.get(
        `/problem/getAllProblems?page=${overridePage}&limit=6`
      );
      const data = res.data;
      console.log("Hello Begginer data, ",data);

      const filtered = filterProblems(data?.problems);
      console.log("Filtered data",filtered);

      if(filtered?.length>0)
      setProblemArr((prev) => ([...prev],[...filtered]));

      // Reset page correctly if filtered
      setPage(overridePage + 1);

      // Only set hasMore false if less than expected (e.g. less than 6 results)
      setHasMore(data.problems.length >= 6);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    }
  };

  const filterProblems = (arr) => {
    const newProblemArr = arr.filter((problem) => {
      return problem?.difficulty === "beginner";
    });
    console.log("new PRoblems begginer:",newProblemArr);
    return newProblemArr;
  };

  // Call fetch -
  useEffect(() => {
    if (hasMore && !filtering) {
      fetchProblems();
    }
  },[hasMore,page,filtering]);

  //to automatically mount the component once -
  useEffect(() => {
    // Automatically open the modal when component mounts
    const modal = document.getElementById("my_modal_3");
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    }
  }, []);

  return (
    <>
     { problemArr?
      <div className="w-full">
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button hidden className="btn">
        open modal
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center">Begginer Sheet</h3>
          <div className="py-4 flex flex-col gap-1">
            <AnimatedWrapper>
            {problemArr?.map((problem, index) => {
              return (
                <Link
                  to={`/problem/${problem._id}`}
                  key={problem._id}
                  className={`grid grid-rows-1 grid-cols-3 items-center border-t border-gray-100 rounded-sm ${
                    problem?.solved
                      ? "bg-green-200"
                      : index % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  }  h-10 w-full hover:bg-gray-100 
                px-2 py-1 rounded-xl`}
                >
                  <div
                    className={`flex justify-center font-semibold sm:text-base text-xs`}
                  >{`${index + 1}. ${problem?.title}`}</div>
                  <div className="flex justify-center">
                    <span
                      className={`mr-3 badge font-semibold ${
                        problem?.difficulty == "medium"
                          ? "badge-outline badge-warning"
                          : problem?.difficulty == "easy"
                          ? "badge-outline badge-success"
                          : problem?.difficulty == "beginner"
                          ? "badge-outline badge-info"
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
              );
            })}
            </AnimatedWrapper>
          </div>
        </div>
      </dialog>
      </div>
      :
       <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => navigate("/")}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center">Begginer Sheet</h3>
          <div className="flex justify-center">
            <Loader/>
            </div>
          </div>
         </dialog>
        }
    </>
  );
}
