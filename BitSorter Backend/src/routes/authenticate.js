const express = require('express');
const authRouter = express.Router();
const userMiddleWare = require('../middleware/userMiddleWare');
const adminMiddleWare = require('../middleware/adminMiddleWare');
const upload = require('../config/multer');
const passport = require('passport');
const {registerUser,loginUser,logOutUser,adminRegister,verifyUser,deleteUser,check,getUserDetails,googleLogin,facebookLogin,githubLogin,uploadAvatar,changeFirstName} = require('../controllers/authenticateControllers');

authRouter.post('/register',registerUser);
authRouter.post('/verifyUser',verifyUser);
authRouter.post('/login',loginUser);
authRouter.post('/logout',userMiddleWare,logOutUser);
authRouter.delete('/delete',userMiddleWare,deleteUser);
authRouter.get('/check',check);
authRouter.get('/getUserDetails',userMiddleWare,getUserDetails);
authRouter.post('/upload/avatar',userMiddleWare,upload.single("avatar"),uploadAvatar);
authRouter.post('/change/firstName',userMiddleWare,changeFirstName);

// Google OAuth routes
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false
  }),
  googleLogin
);

// Facebook OAuth routes
authRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false
  }),
  facebookLogin
);

// GitHub OAuth routes
authRouter.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false
  }),
  githubLogin
);


//Note :- Only old admin can register the new admin, so old admin must be logged in into his/her account in order to 
// register the new admin. so i need to create a middleware in order to check whether the old admin is logged in or not.
// if old admin is logged in then only i will allow him/her to register the new admin or new user. 

authRouter.post('/admin/register',adminMiddleWare,adminRegister);

module.exports = authRouter;