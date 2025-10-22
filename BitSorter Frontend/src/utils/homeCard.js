import React from "react";
import { useNavigate } from "react-router";
import BegginerSheet from "../components/begginerSheet";
import { useSelector } from "react-redux";

const HomeCard = ({
  idx,
  title,
  description,
  color = "bg-blue-100",
  accent = "text-blue-800",
  hov = "bg-orange-200",
}) => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state?.isDark?.isDark);

  return (
    <div
      className={`${
        isDark ? "bg-gray-900" : ""
      } sm:px-8 sm:py-8 px-4 py-10 w-full ${"col-span-2"} transition-all duration-300 delay-100 hover:scale-[1.03]
     hover:${
       isDark ? "bg-blue-500" : "bg-blue-50"
     } ring-1 ring-blue-300 border border-blue-400 rounded-2xl shadow-md ${color}`}
    >
      <h2 className={`sm:text-2xl text-xl font-semibold mb-2 ${accent}`}>
        {title}
      </h2>
      <p className="sm:text-sm hidden sm:block text-xs text-gray-700 mb-4">
        {description}
      </p>
      <button
        onClick={() =>
          idx == 0
            ? navigate("/visualizer")
            : idx == 1
            ? navigate("problemShow")
            : navigate("/courses")
        }
        className={`sm:px-4 sm:py-2 hover:scale-110 duration-100 px-2 py-1.5 text-sm font-medium rounded-lg ${accent} border ${accent} hover:bg-opacity-10`}
      >
        Start Learning →
      </button>
    </div>
  );
};

export default HomeCard;
