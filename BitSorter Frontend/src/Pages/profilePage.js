import { useNavigate } from "react-router";
import { logoutUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient";
const UserLogo = new URL("../assets/UserLogo.png", import.meta.url).href;
import RadialStats from "../Ui/RadialStats";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import Loader from "../Ui/Loader";
import UserSettings from "../components/UserSetting";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosClient.get("/problem/solvedProblems");
        const response = await axiosClient.get("/problem/getCount");
        const count = response?.data;
        //console.log("THis is count", count);
        setTotal(count.count);
        const data = res?.data;
        setUser(data);
      } catch (err) {
        console.log(
          "This is error from profile getSubmission frontend : ",
          err
        );
      }
    };
    getData();
  }, []);

  //console.log("This is user", user);
  return (
    <>
      <div className={`sm:h-screen h-full ${isDark?'bg-gray-900':''} ${isDark?'text-white':''}`}>
        <div className="lg:h-[90%] flex lg:flex-row flex-col-reverse lg:gap-6 gap-3 justify-center items-center">
          {user ? (
            <>
              <AnimatedWrapper>
                <div className="flex flex-col">
                  <p className={`text-center ${isDark?'text-white':''} font-extralight text-2xl`}>
                    Solved Problems
                  </p>
                  <div className="border border-gray-300 rounded-sm p-4">
                    { user?.problemSolved?.length>0? 
                      <div className="flex flex-col rounded-sm mx-1">
                      <AnimatedWrapper>
                        {user?.problemSolved?.map((problem, index) => {
                          return (
                            <AnimatedWrapper key={index}>
                              <Link
                                to={`/problem/${problem._id}`}
                                key={problem._id}
                                className={`grid grid-rows-1 grid-cols-3 items-center border-t ${
                                  isDark ? "border-gray-900" : "border-gray-100"
                                } rounded-sm ${
                                  isDark
                                    ? index % 2 === 0
                                      ? "bg-gray-800"
                                      : "bg-black"
                                    : index % 2 === 0
                                    ? "bg-gray-50"
                                    : "bg-white"
                                }  h-10 w-full ${isDark?'hover:bg-green-600':'hover:bg-gray-100'} 
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
                    :
                    <div>No Problem Solved</div>
                   }
                  </div>
                </div>
              </AnimatedWrapper>
              <AnimatedWrapper>
                <div className="p-4 sm:w-96 lg:h-[90%] w-80 flex flex-col gap-3 justify-center items-center border border-gray-100 shadow-xl rounded-sm">
                  {/* Preview */}
                  <div>
                    {(user?.avatarUrl || UserLogo) && (
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={user?.avatarUrl || UserLogo}
                          alt="Preview"
                          className="mt-2 rounded-full md:w-40 md:h-40 w-28 h-28 object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-center mt-2 text-xl font-semibold">
                        {user?.firstName}
                      </p>
                    </div>
                  </div>

                  {/* Open the modal using document.getElementById('ID').showModal() method */}
                  <button
                    className={`btn`}
                    onClick={() =>
                      document.getElementById("my_modal_1").showModal()
                    }
                  >
                    User Settings
                  </button>
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <UserSettings user={user}/>
                      <div className="modal-action">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className={`btn`}>Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>

                  <RadialStats user={user} total={total} />
                </div>
              </AnimatedWrapper>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
}
