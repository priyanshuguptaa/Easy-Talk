const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(`database connected ${conn.connection.host}`);
  } catch (error) {
    console.log(`error ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
