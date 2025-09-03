import Loader from "../Ui/Loader";
import { useSelector } from "react-redux";

const ResultView = ({ runData }) => {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  console.log("this is runData :", runData);
  return (
    <>
      {runData ? (
        <div className="p-6 flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
          {/* Run Status */}
          {runData?.reply?.submissionStatus === "Accepted" && (
            <div className="text-green-500 font-medium text-lg">
              ✅ Run Successfully
            </div>
          )}

          <div
            className={`text-xl font-semibold ${
              runData?.reply?.submissionStatus === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {runData?.reply?.submissionStatus}
          </div>

          {/* Error */}
          {runData?.reply?.error && (
            <div className="px-4 py-2 rounded-lg bg-red-50 border border-red-300 text-red-600 font-medium text-center w-full">
              {runData?.reply?.error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {!runData?.reply?.error && (
              <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
                <div className="text-sm text-gray-600">⏱ Runtime</div>
                <div className="text-lg font-semibold text-gray-800">
                  {Number(runData?.reply?.runtime) * 1000} ms
                </div>
              </div>
            )}

            {!runData?.reply?.error && (
              <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
                <div className="text-sm text-gray-600">💾 Memory</div>
                <div className="text-lg font-semibold text-gray-800">
                  {runData?.reply?.memory} KB
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
              <div className="text-sm text-gray-600">✅ Test Cases Passed</div>
              <div className="text-lg font-semibold text-gray-800">
                {runData?.reply?.testCasesPassed}
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
              <div className="text-sm text-gray-600">📊 Total Test Cases</div>
              <div className="text-lg font-semibold text-gray-800">
                {runData?.reply?.totalTestCases}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center font-semibold text-2xl">
          <Loader />
        </div>
      )}
    </>
  );
};
/* const reply = {
      runtime: runtime,
      memory: memorySpace,
      testCasesPassed: testCasesPassed ? testCasesPassed : 0,
      submissionStatus: submissionStatus,
      totalTestCases: totaltestcases,
      error: error,
    }; */
const TestCaseView = ({ submitData }) => {
  console.log("this is submit Data :", submitData);
  const isDark = useSelector((state) => state?.isDark?.isDark);
  return (
    <>
      {submitData ? (
        <div className="p-6 flex flex-col items-center gap-5 w-full max-w-xl mx-auto">
          {/* Submission Status */}
          <div
            className={`px-4 py-2 rounded-lg font-semibold text-lg ${
              submitData?.reply?.submissionStatus === "Accepted"
                ? "bg-green-100 text-green-600 border border-green-300"
                : "bg-red-100 text-red-600 border border-red-300"
            }`}
          >
            {submitData?.reply?.submissionStatus === "Accepted"
              ? "✅ Submitted Successfully"
              : submitData?.reply?.submissionStatus}
          </div>

          {/* Error Message */}
          {submitData?.reply?.error && (
            <div className="px-4 py-2 rounded-lg bg-red-50 border border-red-300 text-red-600 font-medium text-center w-full">
              {submitData?.reply?.error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {!submitData?.reply?.error && (
              <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
                <div className="text-sm text-gray-600">⏱ Runtime</div>
                <div className="text-lg font-semibold text-gray-800">
                  {Number(submitData?.reply?.runtime) * 1000} ms
                </div>
              </div>
            )}

            {!submitData?.reply?.error && (
              <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
                <div className="text-sm text-gray-600">💾 Memory</div>
                <div className="text-lg font-semibold text-gray-800">
                  {submitData?.reply?.memory} KB
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
              <div className="text-sm text-gray-600">✅ Test Cases Passed</div>
              <div className="text-lg font-semibold text-gray-800">
                {submitData?.reply?.testCasesPassed}
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 shadow-sm">
              <div className="text-sm text-gray-600">📊 Total Test Cases</div>
              <div className="text-lg font-semibold text-gray-800">
                {submitData?.reply?.totalTestCases}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center font-semibold text-2xl">
          <Loader />
        </div>
      )}
    </>
  );
};

export { TestCaseView, ResultView };
