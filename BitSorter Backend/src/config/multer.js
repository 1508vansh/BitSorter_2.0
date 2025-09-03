// multer.js
const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory as Buffer
const upload = multer({ storage });

module.exports = upload;
