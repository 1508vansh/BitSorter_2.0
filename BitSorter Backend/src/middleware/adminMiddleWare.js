const jwt = require("jsonwebtoken");
const redisClient = require('../config/RedisConnect');
const User = require('../models/user');

//Note :- Only old admin can register the new admin, so old admin must be logged in into his/her account in order to 
// register the new admin. so i need to create a middleware in order to check whether the old admin is logged in or not.
// if old admin is logged in then only i will allow him/her to register the new admin or new user. 

const adminMiddleWare = async(req,res,next)=>{
     try{
     const { token } = req.cookies;

      if(!token){
         return res.status(401).json({ message: `Token doesn't exist`});
      }

      const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);

      //checking the admin role also, if it is correct or not.
      const IsUserPresent = await User.exists({email:payload.email,role:'admin'});

      //if user doesn't exist then throw error...
      if(!IsUserPresent){
          throw new Error("Admin does not exist!");
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
         return res.status(401).json({ message: 'Invalid Admin!' });
    }
}

module.exports = adminMiddleWare;