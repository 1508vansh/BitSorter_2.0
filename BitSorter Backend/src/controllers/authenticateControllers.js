const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/RedisConnect");
const validateBody = require("../utils/validateBody");
const Submission = require("../models/submission");
const { OAuth2Client } = require("google-auth-library");
const cloudinary = require("../config/cloudinary");

//RegisterUser...
const registerUser = async (req, res) => {
  try {
    //Extracting the keys from body
    validateBody(req.body);
    const { firstName, email, password } = req.body;

    //converting password into hash with 10 saltrounds
    const hashPass = await bcrypt.hash(password, 10);

    //checking wheater user is already present or not...
    const AlreadyPresent = await User.findOne({ email });

    if (AlreadyPresent) {
      res.status(409).json({ message: "User is already Present" });
    }
    //if user is not present in DB then store it...
    const newUser = await User.create({
      firstName: firstName,
      email: email,
      password: hashPass,
      role: "user",
    });

    //Creating JWT token.......
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "12h", // 1 day
    });

    const reply = {
      user: newUser,
    };

    //Send the JWT as a cookie in the HTTP response
    // res.cookie("token", token, { maxAge: 60 * 60 * 60 * 1000 }); //maxAge: milliseconds....(1 hour in this case)...

    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (good for security)
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
      secure: true, // true if frontend is HTTPS (false for localhost)
      sameSite: "none", // "lax" works for cross-origin local testing
    });

    res.status(201).json(reply);
  } catch (err) {
    console.log("Error is occuring : ", err);
    res.status(404).json({ message: "Invalid Credentials" });
  }
};

//Login User...
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    //const tokenPresent = req.cookies.token;

    if (tokenPresent) {
      const isBlocked = await redisClient.exists(`token:${tokenPresent}`);
      if (isBlocked) {
        res.clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        return res
          .status(401)
          .json({ message: "Token is blocked. Please login again." });
      }
    }

    //finding user...
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist!" });
    }
    if (user.role == "admin") {
      if (user.password != password) {
        throw new Error("Incorrect Password!:");
      }
    } else {
      //checking the password...
      const isCorrectPass = await bcrypt.compare(password, user.password);
      if (!isCorrectPass) {
        throw new Error("Incorrect Password!:");
      }
    }

    const token = jwt.sign(
      { email: email, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "12h",
      }
    );

    const reply = {
      user: user,
    };
    console.log("this is user bakend:", user);
    //Send the JWT as a cookie in the HTTP response
    // res.cookie("token", token, { maxAge: 60 * 60 * 60 * 1000 });

    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (good for security)
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
      secure: true, // true if frontend is HTTPS (false for localhost)
      sameSite: "none", // "lax" works for cross-origin local testing
    });

    //if successfully login then send status...
    res.status(200).send(reply);
  } catch (err) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.result._id;

    console.log("File:", file);
    console.log("User:", userId);

    // Upload to Cloudinary using the imported config
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      async (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ "This is error from cloudinary": error.message });

        console.log("this is result from cloudinary : ", result);
        const imageUrl = result.secure_url;

        console.log("This is Image Url", imageUrl);
        // Save result.secure_url in MongoDB or respond
        const getUser = await User.findById(userId);
        getUser.avatarUrl = imageUrl;
        await getUser.save();
        console.log("this is db user, ", getUser);

        res.json({ message: "Uploaded successfully!", url: result.secure_url });
      }
    );

    uploadStream.end(file.buffer);
  } catch (err) {
    console.error("Upload Avatar Error: error details : ", err);
    return res.status(401).json({ message: "cannot upload avatar!" });
  }
};

const googleLogin = async (req, res) => {
  try {
    //console.log("Entered backend part");
    const { credential } = req.body;
    //console.log("Credential id", process.env.GOOGLE_CLIENT_ID);
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: name,
        email,
        password: null,
        role: "user",
      });
      //if(user) console.log("DB new User is created successfully");
      //else console.log("Not created new user")
    }

    const token = jwt.sign(
      { email: email, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "12h",
      }
    );

    // THIS MUST ALWAYS RUN for both new and existing users:
    //res.cookie("token", token, { maxAge: 60 * 60 * 60 * 1000, httpOnly: true });

    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (good for security)
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
      secure: true, // true if frontend is HTTPS (false for localhost)
      sameSite: "none", // "lax" works for cross-origin local testing
    });

    const reply = {
      user: user,
    };
    console.log("this is user bakend:", user);
    res.status(200).json(reply);
  } catch (err) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }
};

//Logout User
const logOutUser = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const key = `token:${token}`;

    await redisClient.set(key, "Blocked");

    await redisClient.expireAt(key, payload.exp);
    //deleting the token
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).send("Logged Out Successfully");
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//new admin register by old admin
const adminRegister = async (req, res) => {
  try {
    validateBody(req.body);
    const { firstName, email, password, role } = req.body;

    //converting password into hash with 10 saltrounds
    const hashPass = await bcrypt.hash(password, 10);

    //checking wheater user/admin is already present or not...
    const AlreadyPresent = await User.findOne({ email });

    if (AlreadyPresent) {
      res.status(409).json({ message: `${role} is already Present` });
    }
    //if user is not present in DB then store it...
    await User.create({
      firstName: firstName,
      email: email,
      password: hashPass,
      role: role,
    });

    //sending response status...

    //Creating JWT token.......
    const token = jwt.sign(
      { email: email, role: role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "12h",
      }
    );

    //Send the JWT as a cookie in the HTTP response
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); //maxAge: milliseconds....(1 hour in this case)...

    res.status(201).json({ message: `${role} Created` });
  } catch (err) {
    console.log("Error is occuring : ", err);
    return res.status(404).json({ message: "Invalid Credentials" });
  }
};

//to delete user...

const deleteUser = async (req, res) => {
  try {
    const userId = req.result._id;

    await User.findByIdAndDelete(userId);

    await Submission.deleteMany(userId);
  } catch (err) {
    res.status(401).send("Error in deleting User");
  }
};

//to check the authenticity of user...
const check = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: `Token doesn't exist` });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const IsUserPresent = await User.exists({ email: payload.email });

    //if user doesn't exist then throw error...
    if (!IsUserPresent) {
      return res.status(401).json({ message: "User does not exist!" });
    }

    const result = await User.findOne({ email: payload.email });
    req.result = result;

    const key = `token:${token}`;
    const IsBlocked = await redisClient.exists(key);

    const reply = {
      user: result,
    };
    //if token is already blocked...
    if (IsBlocked) {
      return res.status(401).json({ message: "The token is already Blocked!" });
    }
    res.status(200).send(reply);
  } catch (err) {
    res.status(401).json({ message: "Invalid User!" });
    console.log({ message: "Invalid User!" });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: `Token doesn't exist` });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ email: payload.email });
    const reply = {
      user: user,
    };
    res.status(200).send(reply);
  } catch (err) {
    res.status(401).json({ message: "Invalid User!" });
    console.log({ message: "Invalid User!" });
  }
};

const changeFirstName = async (req, res) => {
  console.log("reached the firstName bacen");
  try {
    console.log("Reached Firstname backend");
    const { name } = req.body;
    const userId = req.result._id;

    const user = await User.findById(userId);
    user.firstName = name;
    await user.save();

    res.status(200).send("Successfully changed User Name!");
  } catch (err) {
    res.status(401).json({ message: "Can't change the User Name!" });
    console.log({ message: "Invalid User!" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logOutUser,
  adminRegister,
  deleteUser,
  check,
  getUserDetails,
  googleLogin,
  uploadAvatar,
  changeFirstName,
};
