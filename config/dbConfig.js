// src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // The following options are deprecated and will be ignored
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
};

module.exports = connectDB;