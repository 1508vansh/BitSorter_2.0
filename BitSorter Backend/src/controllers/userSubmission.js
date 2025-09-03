const Submission = require("../models/submission");
const Problem = require("../models/problem");
const getLanguageId = require("../utils/getLanguageId");
const { submitBatch, submitTokens } = require("./problemsUtility");

const userSubmission = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.result._id;
    const { code, language } = req.body;

    //checking if everything is present...
    if (!problemId || !userId || !code || !language) {
      return res.status(401).send("Submission data field is missing!");
    }

    //Initially storing the data in the db with pending status...
    console.log("created submission");
    const submittedProblem = await Submission.create({
      userId: userId,
      problemId: problemId,
      code: code,
      language: language,
      status: "pending",
    });
    //fetching the problem from db
    const problembyId = await Problem.findById(problemId);

    const languageId = getLanguageId(language);

    const submissions = problembyId.hiddenTestCases.map(
      ({ input, output }) => ({
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      })
    );

    const submitResult = await submitBatch(submissions);

    const tokenArray = submitResult?.map((obj) => obj.token);

    const testResult = await submitTokens(tokenArray);
    //console.log(testResult);

    let testCasesPassed = 0;
    let error = null;
    let runtime = 0;
    let memorySpace = 0;
    let submissionStatus = "";
    let totaltestcases = testResult ? Object.keys(testResult).length : 0;

    for (const { status_id, status, stderr, time, memory } of testResult) {
      if (status_id == 3) {
        testCasesPassed++;
        runtime = Math.max(runtime, time);
        memorySpace = Math.max(memorySpace, memory);
        submissionStatus = status?.description;
      } else {
        submissionStatus = status?.description;
        error = stderr;
      }
    }

    submittedProblem.runtime = runtime;
    submittedProblem.memory = memorySpace;
    submittedProblem.testCasesPassed = testCasesPassed;
    submittedProblem.status = submissionStatus;
    submittedProblem.totalTestCases = problembyId.hiddenTestCases.length;
    submittedProblem.errorMessage = error;

    //saving the submission details in db
    await submittedProblem.save();

    if (
      submissionStatus == "Accepted" &&
      !req.result.problemSolved.includes(problemId)
    ) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    const reply = {
      runtime: runtime,
      memory: memorySpace,
      testCasesPassed: testCasesPassed ? testCasesPassed : 0,
      submissionStatus: submissionStatus,
      totalTestCases: totaltestcases,
      error: error,
    };
    res.status(200).send({ reply });
  } catch (err) {
    return res.status(404).send("Error in submitting the Problem!");
  }
};

const runCode = async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.result._id;
    const { code, language } = req.body;

    //checking if everything is present...
    if (!problemId || !userId || !code || !language) {
      return res.status(401).send("Submission data field is missing!");
    }

    //fetching the problem from db
    const problembyId = await Problem.findById(problemId);

    const languageId = getLanguageId(language);
    console.log("this is runnn")
    const submissions = problembyId?.visibleTestCases?.map(
      ({ input, output }) => ({
        source_code: code,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      })
    );

    const submitResult = await submitBatch(submissions);

    const tokenArray = submitResult?.map((obj) => obj.token);

    const testResult = await submitTokens(tokenArray);

    let testCasesPassed = 0;
    let error = null;
    let runtime = 0;
    let memorySpace = 0;
    let submissionStatus = "";
    let totaltestcases = testResult ? Object.keys(testResult).length : 0;

    for (const { status_id, status, stderr, time, memory } of testResult) {
      if (status_id == 3) {
        testCasesPassed++;
        runtime = Math.max(runtime, time);
        memorySpace = Math.max(memorySpace, memory);
        submissionStatus = status?.description;
      } else {
        submissionStatus = status?.description;
        error = stderr;
      }
    }
    //console.log(testResult);

    const reply = {
      runtime: runtime,
      memory: memorySpace,
      testCasesPassed: testCasesPassed ? testCasesPassed : 0,
      submissionStatus: submissionStatus,
      totalTestCases: totaltestcases,
      error: error,
    };
    res.status(200).send({
      reply,
    });
  } catch (err) {
    return res.status(404).send("Error in running the Problem!");
  }
};

module.exports = { userSubmission, runCode};
