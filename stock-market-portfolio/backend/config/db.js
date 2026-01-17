const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    const connectDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connectDb.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDb;
