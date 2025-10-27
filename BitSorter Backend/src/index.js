const express = require('express');
const dbMain = require('./config/db');
const User = require('./models/user');
const {Server} = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRouter = require('./routes/authenticate');
const redisClient = require('./config/RedisConnect');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const aiRouter = require('./routes/aiRouter');
const cors = require('cors');

const app = express();

const httpserver = http.createServer(app);


app.use(express.json());
app.use(cookieParser());

//'https://bitsorter-frontend.onrender.com'
app.use(cors({
  origin: ['http://localhost:1234','https://bitsorter.vercel.app'],
  credentials: true
}));

const io = new Server(httpserver, {
  cors: {
    origin: ['http://localhost:1234', 'https://bitsorter.vercel.app'],
    credentials: true,
  }
});

//exporting io to use in other files...
module.exports = {io};

// Ensure socket controllers are registered (this file attaches handlers to `io`)
// require side-effect: loads src/controllers/roomController.js which uses the exported `io`.
require('./controllers/roomController');


app.use('/user/auth',authRouter);
app.use('/problem',problemRouter);
app.use('/submitProblem',submitRouter);
app.use('/ai',aiRouter);

const ConnectServerAndDB = async()=>{
   try{
      await Promise.all([dbMain(),redisClient.connect()]);
      console.log("Connected to DB!");
      httpserver.listen(process.env.PORT,()=>{
        console.log("Listening at Port ",process.env.PORT);
      })
   }
   catch(err){ 
      console.log("Error in Connecting: ",err);
   }
}
ConnectServerAndDB();

