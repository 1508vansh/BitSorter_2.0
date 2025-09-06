import { useState, useEffect } from "react";
import { toggleMode } from "../slices/darkmode";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../slices/authSlice";
import useWindowSize from "../CustomHook/useWindowSize";
import { useSelector } from "react-redux";

const Logo = new URL("../assets/Logo.png", import.meta.url).href;
const UserLogo = new URL("../assets/UserLogo.png", import.meta.url).href;

function Navbar() {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [isOpen, setIsOpen] = useState(false); // 👈 controls dropdown

  const { width } = useWindowSize();
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    if (width < 640) {
      setDevice("mobile"); // Tailwind: sm breakpoint
    }  else {
      setDevice("desktop");
    }
  }, [width]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosClient.get(`user/auth/getUserDetails`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, []);

  // 👇 helper to close dropdown when clicking an item
  const handleClick = (callback) => {
    setIsOpen(false);
    if (callback) callback();
  };

  return (
    <nav className={`${isDark?'bg-gray-900':'bg-white'} sticky top-0 z-10 border-b border-slate-200 shadow-md`}>
      <div className={`flex justify-between sticky items-center px-5 py-2`}>
        {/* Logo and Title */}
        <Link to={"/"} className="flex items-center relative">
          {/* <img className="h-15 rounded-full" src={Logo} alt="Logo" /> */}
          <span className={`h-15 mt-1 text-orange-500 animate-pulse font-extrabold text-5xl`}>B</span>
          <p className={`${isDark?'text-white':''} text-xl left-12 bottom-3 sm:text-3xl md:text-4xl font-bold text-slate-800 hidden sm:inline`}>
            itSorter
          </p>
        </Link>
        { device==="desktop" && (
          <div className={`${isDark?'text-white':''} flex gap-12 items-center`}>
            <Link
              to={"/"}
              className="font-semibold hover:text-primary"
            >
              Home
            </Link>
            <Link
              to={"/problemShow"}
              className="font-semibold hover:text-secondary"
            >
              Problems
            </Link>
            <Link
              to={"/visualizer"}
              className="font-semibold hover:text-warning"
            >
              Visualizer
            </Link>
            <Link to={"/courses"} className="font-semibold hover:text-accent">Free Courses</Link>
          </div>
        )}
        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <label className={`${isDark?'text-white':''} swap swap-rotate`}>
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              onClick={() => dispatch(toggleMode())}
              className={`theme-controller`}
              value="synthwave"
            />

            {/* sun icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>

          {/* Dropdown */}
          <div className={`relative ${isDark?'bg-gray-900':''}`}>
            <div
              role="button"
              className={`btn btn-ghost btn-circle avatar ${isDark?'bg-gray-900':''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-10 rounded-full">
                <img alt="User" src={UserLogo} />
              </div>
            </div>

            {isOpen && (
              <ul className={`${isDark?'text-white':''} ${isDark?'bg-gray-900':''} menu menu-sm absolute right-0 bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-20`}>
                <li>
                  <button
                    onClick={() => handleClick(() => navigate("/profile"))}
                  >
                    Profile <span className={`badge`}>✦</span>
                  </button>
                </li>
                {user?.user?.role === "admin" && (
                  <button
                    className="btn btn-primary outline-primary"
                  onClick={() => handleClick(()=> navigate("/admin"))}
                   >
                    Admin
                </button>
                )}
                {device==="mobile" && (
                    <li>
                      <button
                        onClick={() => handleClick(() => navigate("/problemShow"))}
                      >
                        Problems
                      </button>
                    </li>
                  )
                }
                {device==="mobile" &&
                  (
                    <li>
                      <button
                        onClick={() => handleClick(() => navigate("/visualizer"))}
                      >
                        Visualizers
                      </button>
                    </li>
                  )
                }
                {device==="mobile" &&
                  (
                    <li>
                      <button onClick={() => handleClick(() => navigate("/courses"))}
                      >
                        Free Courses
                      </button>
                    </li>
                  )
                  }
                <li>
                  <button
                    onClick={() => handleClick(() => dispatch(logoutUser()))}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
