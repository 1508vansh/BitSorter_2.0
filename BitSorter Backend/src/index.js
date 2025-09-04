const express = require('express');
const dbMain = require('./config/db');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRouter = require('./routes/authenticate');
const redisClient = require('./config/RedisConnect');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const aiRouter = require('./routes/aiRouter');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());

//'https://bitsorter-frontend.onrender.com'
app.use(cors({
  origin: ['https://bitsorter.netlify.app'],
  credentials: true
}));

app.use('/user/auth',authRouter);
app.use('/problem',problemRouter);
app.use('/submitProblem',submitRouter);
app.use('/ai',aiRouter);

const ConnectServerAndDB = async()=>{
   try{
      await Promise.all([dbMain(),redisClient.connect()]);
      console.log("Connected to DB!");
      app.listen(process.env.PORT,()=>{
        console.log("Listening at Port ",process.env.PORT);
      })
   }
   catch(err){ 
      console.log("Error in Connecting: ",err);
   }
}
ConnectServerAndDB();
