// AboutUs.jsx
import React from "react";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
const developerImg = new URL("../assets/developer.jpg", import.meta.url).href;
export default function AboutUs() {
  return (
    <AnimatedWrapper>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        About BitSorter
      </h1>

      {/* Description Section */}
      <p className="max-w-3xl text-center text-gray-600 mb-10">
        BitSorter is your go-to platform for mastering Data Structures & Algorithms.
        Our goal is to make learning efficient, visual, and fun. Track your progress, 
        solve problems, and improve your coding skills with a simple and intuitive interface.
      </p>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-xl font-semibold mb-2">Interactive Visualizer</h3>
          <p className="text-gray-500 text-sm">
            Watch algorithms come to life with step-by-step visualizations.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-xl font-semibold mb-2">Curated Problems</h3>
          <p className="text-gray-500 text-sm">
            Solve problems from beginner to advanced levels to strengthen your skills.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-500 text-sm">
            Keep track of your learning journey and see your improvement over time.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meet the Team</h2>
      <div className="flex justify-center items-center gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <img
            src={developerImg}
            alt="Vansh Soni"
            className="rounded-full w-32 h-32 mb-4"
          />
          <h3 className="text-xl font-semibold mb-1">Vansh Soni</h3>
          <p className="text-gray-500 text-sm text-center">
            Founder & Developer. Passionate about learning and building stuff.
          </p>
        </div>
        </div>

      {/* Footer */}
      <p className="text-gray-400 text-sm mt-12 text-center">
        &copy; {new Date().getFullYear()} BitSorter. All rights reserved.
      </p>
    </div>
    </AnimatedWrapper>
  );
}
