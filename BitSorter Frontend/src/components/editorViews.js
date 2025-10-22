import Loader from "../Ui/Loader";
import { useSelector } from "react-redux";

const ResultView = ({ runData }) => {
  const isDark = useSelector((state) => state?.isDark?.isDark);

  return (
    <>
      {runData ? (
        <div
          className={`p-6 rounded-lg border-2 w-full max-w-2xl mx-auto ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header Status */}
          <div className="text-center mb-6">
            {runData?.reply?.submissionStatus === "Accepted" ? (
              <div className="flex items-center justify-center gap-2 text-green-600 text-lg font-semibold">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                Run Successfully
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600 text-lg font-semibold">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✗</span>
                </div>
                {runData?.reply?.submissionStatus}
              </div>
            )}
          </div>

          {/* Error Message */}
          {runData?.reply?.error && (
            <div
              className={`p-4 rounded-lg mb-6 text-center ${
                isDark
                  ? "bg-red-900/30 border border-red-700 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {runData?.reply?.error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {!runData?.reply?.error && (
              <StatCard
                label="⏱ Runtime"
                value={`${Number(runData?.reply?.runtime) * 1000} ms`}
                isDark={isDark}
              />
            )}

            {!runData?.reply?.error && (
              <StatCard
                label="💾 Memory"
                value={`${runData?.reply?.memory} KB`}
                isDark={isDark}
              />
            )}

            <StatCard
              label="✅ Test Cases Passed"
              value={runData?.reply?.testCasesPassed}
              isDark={isDark}
            />

            <StatCard
              label="📊 Total Test Cases"
              value={runData?.reply?.totalTestCases}
              isDark={isDark}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

const TestCaseView = ({ submitData }) => {
  const isDark = useSelector((state) => state?.isDark?.isDark);

  return (
    <>
      {submitData ? (
        <div
          className={`p-6 rounded-lg border-2 w-full max-w-2xl mx-auto ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Header Status */}
          <div className="text-center mb-6">
            {submitData?.reply?.submissionStatus === "Accepted" ? (
              <div className="flex items-center justify-center gap-2 text-green-600 text-lg font-semibold">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                Submitted Successfully
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-600 text-lg font-semibold">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✗</span>
                </div>
                {submitData?.reply?.submissionStatus}
              </div>
            )}
          </div>

          {/* Error Message */}
          {submitData?.reply?.error && (
            <div
              className={`p-4 rounded-lg mb-6 text-center ${
                isDark
                  ? "bg-red-900/30 border border-red-700 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {submitData?.reply?.error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {!submitData?.reply?.error && (
              <StatCard
                label="⏱ Runtime"
                value={`${Number(submitData?.reply?.runtime) * 1000} ms`}
                isDark={isDark}
              />
            )}

            {!submitData?.reply?.error && (
              <StatCard
                label=" Memory"
                value={`${submitData?.reply?.memory} KB`}
                isDark={isDark}
              />
            )}

            <StatCard
              label="✅ Test Cases Passed"
              value={submitData?.reply?.testCasesPassed}
              isDark={isDark}
            />

            <StatCard
              label="Total Test Cases"
              value={submitData?.reply?.totalTestCases}
              isDark={isDark}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

// Reusable Stat Card Component
const StatCard = ({ label, value, isDark }) => (
  <div
    className={`p-4 rounded-lg border text-center ${
      isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
    }`}
  >
    <div
      className={`text-sm font-medium mb-1 ${
        isDark ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {label}
    </div>
    <div
      className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
    >
      {value}
    </div>
  </div>
);

export { TestCaseView, ResultView };
