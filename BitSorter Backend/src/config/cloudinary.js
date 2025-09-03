const { v2 : cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

console.log("Cloudinary configured");
// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("Cloud Key:", process.env.CLOUD_KEY ? "Loaded" : "Missing");
// console.log("Cloud Secret:", process.env.CLOUD_SECRET ? "Loaded" : "Missing");

module.exports = cloudinary;
