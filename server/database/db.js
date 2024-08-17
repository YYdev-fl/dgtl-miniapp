const mongoose = require("mongoose");

const connectToDB = async () => {
    await mongoose.connect(process.env.DATABASE_URI).then((res) => {
        console.log("MongoDB connected succesfully");
    })
}

module.exports = connectToDB;