const mongoose = require('mongoose');

async function dbMain() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
}
module.exports = dbMain;