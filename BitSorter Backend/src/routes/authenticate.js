const express = require('express');
const authRouter = express.Router();
const userMiddleWare = require('../middleware/userMiddleWare');
const adminMiddleWare = require('../middleware/adminMiddleWare');
const upload = require('../config/multer');
const {registerUser,loginUser,logOutUser,adminRegister,deleteUser,check,getUserDetails,googleLogin,uploadAvatar,changeFirstName} = require('../controllers/authenticateControllers');

authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.post('/logout',userMiddleWare,logOutUser);
authRouter.delete('/delete',userMiddleWare,deleteUser);
authRouter.get('/check',check);
authRouter.get('/getUserDetails',userMiddleWare,getUserDetails);
authRouter.post('/upload/avatar',userMiddleWare,upload.single("avatar"),uploadAvatar);
authRouter.post('/change/firstName',userMiddleWare,changeFirstName);

//authentication via google
authRouter.post('/googleLogin',googleLogin);

//Note :- Only old admin can register the new admin, so old admin must be logged in into his/her account in order to 
// register the new admin. so i need to create a middleware in order to check whether the old admin is logged in or not.
// if old admin is logged in then only i will allow him/her to register the new admin or new user. 

authRouter.post('/admin/register',adminMiddleWare,adminRegister);

module.exports = authRouter;