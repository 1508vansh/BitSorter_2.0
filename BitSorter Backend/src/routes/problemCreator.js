const express = require('express');
const problemRouter = express.Router();
const adminMiddleWare = require('../middleware/adminMiddleWare');
const userMiddleWare = require('../middleware/userMiddleWare');
const {createProblem,updateProblem,getCount,deleteProblem,getProblem,getAllProblems,getSolvedProblems, getUserSubmission} = require('../controllers/problemControllers');

//routers to get the problems
problemRouter.get('/getAllProblems',getAllProblems);
problemRouter.get('/getProblem/:id',userMiddleWare,getProblem);
problemRouter.get('/solvedProblems',userMiddleWare,getSolvedProblems);
problemRouter.get('/getUserSubmission/:id',userMiddleWare,getUserSubmission);
problemRouter.get('/getCount',userMiddleWare,getCount);
//submitRouter.post('/getProblemSubmissions/:id',userMiddleWare,getProblemSubmissions);

//routers for CRUD operations on problem...
problemRouter.post('/create',adminMiddleWare,createProblem);
problemRouter.delete('/delete/:id',adminMiddleWare,deleteProblem);
problemRouter.put('/update/:id',adminMiddleWare,updateProblem);

module.exports = problemRouter;
