const mongoose = require("mongoose");
const color = require("color");

 async function connectDB()
 {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to mongoDb");
    } catch (error) {
        console.log("error while connecting to mongoDb");
    }
 }

 module.exports = connectDB;

