const express = require('express');
const submitRouter = express.Router();
const userMiddleWare = require('../middleware/userMiddleWare');
const {userSubmission,runCode} = require('../controllers/userSubmission');

//sumit problem api...
submitRouter.post('/submit/:id',userMiddleWare,userSubmission);
submitRouter.post('/run/:id',userMiddleWare,runCode);

module.exports = submitRouter;