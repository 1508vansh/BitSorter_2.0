import React, { useEffect, useState } from "react";
import { FaSort, FaSearch, FaProjectDiagram, FaBrain, FaChartLine, FaPuzzlePiece, FaTree, FaCalculator, FaFont } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { RiNodeTree } from "react-icons/ri";
import { MdOutlineFormatLineSpacing } from "react-icons/md";
const image1 = new URL("../assets/Selection_of_minrun_by_timsort.svg.png",import.meta.url).href;
const image2 = new URL("../assets/dynamic.png",import.meta.url).href;
const image3 = new URL("../assets/backtracking.png",import.meta.url).href;
const image4 = new URL("../assets/greedy.avif",import.meta.url).href;
const image5 = new URL("../assets/1726894191969.png",import.meta.url).href;
const image6 = new URL("../assets/1_eTQoIHGdG58sy-iMwcp97w.png",import.meta.url).href;
const image7 = new URL("../assets/1_EEmpU5oXP-iLual-5u9aFA.png",import.meta.url).href;
const image8 = new URL("../assets/Greedy_algorithm_36_cents.svg",import.meta.url).href;
const image9 = new URL("../assets/what-is-graphs-in-data-structure.avif",import.meta.url).href;
const image10 = new URL("../assets/stack.jpg",import.meta.url).href;
const image11 = new URL("../assets/Queue.jpg",import.meta.url).href;
const image12 = new URL("../assets/linkedlist.webp",import.meta.url).href;
import { useSelector } from "react-redux";
import { Link } from "react-router";

const algorithmCategories = [
  { name: "Sorting Algorithms", icon: <FaSort />, path: "/visualizer/sorting", borderColor: "border-blue-500", bgColor: "bg-blue-500", image: image1 },
  { name: "Searching Algorithms", icon: <FaSearch />, path: "/visualizer/searching", borderColor: "border-green-500", bgColor: "bg-green-500", image: image6 },
  { name: "Stack Algorithms", icon: <BsStack />, path: "/visualizer/stack", borderColor: "border-orange-500", bgColor: "bg-orange-500", image: image10 },
  { name: "Queue Algorithms", icon: <MdOutlineFormatLineSpacing />, path: "/visualizer/queue", borderColor: "border-yellow-500", bgColor: "bg-yellow-500", image: image11 },
  { name: "Linked-List", icon: <RiNodeTree />, path: "/visualizer/linked-List", borderColor: "border-pink-500", bgColor: "bg-pink-500", image: image12 },
  { name: "Graph Algorithms", icon: <FaProjectDiagram />, path: "/visualizer/graph", borderColor: "border-purple-500", bgColor: "bg-purple-500", image: image9 },
  { name: "Dynamic Programming", icon: <FaBrain />, path: "/visualizer/dp", borderColor: "border-red-500", bgColor: "bg-red-500", image: image2 },
  { name: "Greedy Algorithms", icon: <FaChartLine />, path: "/visualizer/greedy", borderColor: "border-yellow-500", bgColor: "bg-yellow-500", image: image4 },
  { name: "Backtracking", icon: <FaPuzzlePiece />, path: "/visualizer/backtracking", borderColor: "border-gray-500", bgColor: "bg-gray-600", image: image3 },
  { name: "Tree Algorithms", icon: <FaTree />, path: "/visualizer/tree", borderColor: "border-teal-500", bgColor: "bg-teal-500", image: image5 },
];

export default function AlgorithmCards() {
  const isDark = useSelector((state) => state?.isDark?.isDark);

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-white'} w-full`}>
    <div className={`container mx-auto px-4 py-12 transition-colors duration-300`}>
      <h2 className={`text-4xl font-bold ${isDark?'text-red-200':'text-white-800'} text-center mb-12 `}>
        Explore Algorithm Categories
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6">
        {algorithmCategories.map((algo, index) => (
          <Link to={algo.path}
            key={index}
            className={`group relative rounded-2xl p-6 flex flex-col items-center cursor-pointer
              transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
              border ${algo.borderColor} border-t-4
              ${isDark?algo.bgColor:'bg-white'} shadow-xl hover:shadow-2xl
              hover:-translate-y-1.5 active:translate-y-0`}
          >
            {/* Icon Container */}
            <div className={`p-4 rounded-2xl ${algo.bgColor} text-white mb-6 
              transition-colors group-hover:rounded-xl`}>
              <div className="text-4xl transform group-hover:scale-110 transition-transform">
                {algo.icon}
              </div>
            </div>

            {/* Enhanced Image Container */}
            <div className="w-full aspect-video mb-6 rounded-xl overflow-hidden border-2 border-gray-100 
              dark:border-gray-700 shadow-sm relative bg-gray-100 dark:bg-gray-700">
              <div className={`absolute inset-0 bg-gradient-to-t ${algo.bgColor.replace('bg', 'from')}/30 to-transparent z-10`} />
              <img
                src={algo.image}
                alt={algo.name}
                className="w-full h-full object-cover object-center transform transition-transform 
                  duration-300 group-hover:scale-105 absolute inset-0"
                style={{
                  ...(algo.image === image8 && { objectFit: 'contain', padding: '8px' }),
                  ...([image2, image3, image4].includes(algo.image) && { objectPosition: 'top center' })
                }}
              />
            </div>
            {index>4 &&
            <div className="text-2xl text-amber-500 font-bold">
               Coming-Soon
            </div>
            }
            {/* Text Content */}
            <div className="text-center">
              <h3 className={`text-2xl font-bold ${isDark?'text-gray-100':'text-gray-800'} mb-2`}>
                {algo.name}
              </h3>
              <p className={`${isDark?'text-gray-400':'text-gray-600'} text-sm font-medium`}>
                Click to visualize →
              </p>
            </div>
         
            {/* Hover Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 
              transition-all duration-300 pointer-events-none" />
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}