import { useSelector } from "react-redux";

export default function HeroSection({ scrollfun }) {
  const isDark = useSelector((state) => state?.isDark?.isDark);

  const line = isDark ? "#2f3542" : "#e5e7eb"; // grid line color

  return (
    <div
      className={`relative overflow-hidden z-0 hero h-[90%] py-20 border-b
        ${isDark
          ? "bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-800"
          : "bg-white bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100"
        }`}
    >
      {/* background grid pattern (behind everything) */}
      <div
        className="absolute inset-0 opacity-90 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px),
                            linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* soft glowing circles for depth (above grid, below content) */}
      <div className="absolute top-12 left-12 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40 z-[1]" />
      <div className="absolute bottom-16 right-16 w-56 h-56 bg-purple-100 rounded-full blur-3xl opacity-40 z-[1]" />

      {/* content (transparent so grid shows “inside” this area) */}
      <div className="hero-content bg-transparent text-center py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className={`${isDark ? "text-white" : "text-gray-900"} text-6xl font-extrabold`}>
            <span className="text-blue-800 animate-pulse">B</span>itSorter
          </h1>
          <p className={`py-6 text-lg ${isDark ? "text-gray-100" : "text-gray-700"}`}>
            Master <span className="text-blue-800 font-semibold">Data Structures</span> &{" "}
            <span className="text-blue-800 font-semibold">Algorithms</span> with interactive
            problems, visualizers, and AI guidance — everything you need in one platform.
          </p>
          <button
            onClick={scrollfun}
            className="bg-blue-800 hover:scale-105 text-white px-8 py-3 rounded-2xl shadow hover:bg-blue-700 transition text-lg font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
