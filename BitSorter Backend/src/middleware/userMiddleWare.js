const jwt = require("jsonwebtoken");
const redisClient = require('../config/RedisConnect');
const User = require('../models/user');


const userMiddleWare = async(req,res,next)=>{
     try{
     const { token } = req.cookies;

      if(!token){
         return res.status(401).json({ message: `Token doesn't exist`});
      }

      const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);

      const IsUserPresent = await User.exists({email:payload.email});

      //if user doesn't exist then throw error...
      if(!IsUserPresent){
          return res.status(401).json({ message: 'User does not exist!' });
      }

      const result = await User.findOne({email:payload.email});
      req.result = result;

      const key = `token:${token}`;
      const IsBlocked = await redisClient.exists(key);
      
      //if token is already blocked...
      if(IsBlocked){
          return res.status(401).json({ message: 'The token is already Blocked!' });
      }
      next();
    }
    catch(err){
        res.status(401).json({ message: 'Invalid User!' });
        console.log({ message: 'Invalid User!' });
    }
}

module.exports = userMiddleWare;