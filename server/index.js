require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const { connect } = require("mongoose");
const connectToDB = require('./database/db.js');
const User = require("./models/user-data.model.js");


const app = express();

app.use(cors());

connectToDB();

app.get("/user", async (req, res) => {
  try{
    const result = await User.find();
    res.send({
      succes: true,
      message: "User Data Retrieved Succesfully",
      data: result,
    });
  } catch(error) {
    const result = await User.find();
    res.send({
      succes: false,
      message: "Failed To Retrieve User Data",
      data: result,
    })
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on `, process.env.PORT);
});


