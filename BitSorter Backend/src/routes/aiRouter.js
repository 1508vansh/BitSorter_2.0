const express = require('express');
const aiRouter = express.Router();
const userMiddleWare = require('../middleware/userMiddleWare');
const {handleAi} = require('../controllers/aiController');

aiRouter.post('/chat',handleAi);

module.exports = aiRouter;