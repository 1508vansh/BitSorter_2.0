const { submitBatch, submitTokens } = require("./problemsUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const getLanguageId = require("../utils/getLanguageId");
const req = require("express/lib/request");
const Submission = require("../models/submission");

//create Problem..........
const createProblem = async (req, res) => {
  const {
    title,
    description,
    tags,
    visibleTestCases,
    difficulty,
    referenceSolution,
  } = req.body;
  try {
    console.log("entered the creation try block!");

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageId(language);

      const submissions = visibleTestCases?.map(({ input, output }) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submitResult = await submitBatch(submissions);
      console.log("this is submit result ", submitBatch);
      const tokenArray = submitResult?.map((obj) => obj.token);
      console.log("THis is token array :", tokenArray);
      if (!tokenArray || tokenArray?.length == 0) {
        return res.status(401).send("No token for submission!");
      }
      const testResult = await submitTokens(tokenArray);
      //console.log(testResult);

      for (const { status_id } of testResult) {
        if (status_id != 3) {
          return res.status(400).send("Error in code!");
        }
      }
    }
    const createdProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });
    res.status(201).send("Problem saved successfully!");
    console.log("Problem created!");
  } catch (err) {
    console.log("Error in creating problem :", err);
    return res.status(401).send("Error in creating problem!");
  }
};

//update Problem.........
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      tags,
      visibleTestCases,
      difficulty,
      referenceSolution,
    } = req.body;

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageId(language);

      const submissions = visibleTestCases.map(({ input, output }) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submitResult = await submitBatch(submissions);

      const tokenArray = submitResult.map((obj) => obj.token);

      const testResult = await submitTokens(tokenArray);

      for (const { status_id } of testResult) {
        if (status_id != 3) {
          return res.status(400).send("Error in code!");
        }
      }
    }

    //checking if got id or not...
    if (!id) {
      return res.status(401).send("Id is missing!");
    }

    //checking if the problem of the given id is present or not......
    const problem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true }
    );

    if (!problem) {
      return res.status(401).send("Problem of give id is not present!");
    }
    res.status(200).send("Problem Updated Successfully!");
  } catch (err) {
    return res.status(401).send("Cannot Update Problem! Error occured.");
  }
};

//delete Problem.....
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    //checking if got id or not...
    if (!id) {
      return res.status(401).send("Id is missing!");
    }

    //checking if the problem of the given id is present or not......
    const problem = await Problem.findByIdAndDelete(id);

    if (!problem) {
      return res.status(401).send("Problem of give id is not present!");
    }
    res.status(200).send("Problem deleted Successfully!");
  } catch (err) {
    return res.status(401).send("Cannot delete Problem Error!");
  }
};

//getting all problems...
const getAllProblems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const problems = await Problem.find().skip(skip).limit(limit);

    const total = await Problem.countDocuments();
    const totalPages = Math.ceil(total / limit);

    if (!problems) {
      return res.status(401).send("Problems not found!");
    }

    const reply = {
      problems,
      currentPage: page,
      totalPages,
      totalProblems: total,
    };

    res.status(200).json(reply);
  } catch (err) {
    res.status(401).send("Error occured in finding Problems!");
  }
};

const getProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(401).send("Id is Missing!");
    }

    const ProblemById = await Problem.findById(id);

    if (!ProblemById) {
      return res.status(401).send("Problems not found!");
    }

    res.status(200).json(ProblemById);
  } catch (err) {
    res.status(401).send("Error occured in finding Problem!");
  }
};

//getting solved problems...
const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    console.log("user id :", userId);
    const userById = await User.findById(userId);
    console.log("found user: ", userById);
    if (!userById) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log("User id: ", userById);

    //   const populatedUser = await userById.populate({
    //        path: 'problemSolved',
    //        select: '_id title tags difficulty'
    //  });
    const populatedUser = await userById.populate("problemSolved");
    console.log("Populated user: ", populatedUser);

    res.status(200).send(populatedUser);
  } catch (err) {
    res.status(401).send("Error occured in finding Solved Problems!");
  }
};

//getting submissions of particular problem...
const getUserSubmission = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    const data = await Submission.find({ userId, problemId });

    res.status(200).send(data);
  } catch (err) {
    res.stutus(401).send("Error in fetching submissions of this problem");
  }
};

const getCount = async (req, res) => {
  try {
    const count = await Problem.countDocuments();

    res.status(200).send({count});
  } catch (err) {
    console.log("Error in getting count : ", err);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getAllProblems,
  getSolvedProblems,
  getUserSubmission,
  getCount,
};
