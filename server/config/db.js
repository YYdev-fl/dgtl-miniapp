const mongoose = require('mongoose');
require("dotenv").config();
const URI = "mongodb+srv://daifenracs:Moon2004!@users-data.hwgfu.mongodb.net/?retryWrites=true&w=majority&appName=users-data"


const connectToDB = async () => {
  try {
    await mongoose.connect(URI, {
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      socketTimeoutMS: 45000,  // 45 seconds socket timeout
    });
    console.log('MongoDB connected successfully');
    mongoose.set('debug', true); // Enable Mongoose debugging

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectToDB;
