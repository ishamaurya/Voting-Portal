// requiring dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./configDB/db");

const authRoute = require("./routes/authRoute.js")
const path = require('path');

// config
dotenv.config();

// connect DB
connectDB();


// creating app
const app = express();

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, './frontend/build')));

// 
app.use('/api/v1/auth',authRoute)

// app.method("path",callback())
app.get("/",(req,res)=>{
    res.send("hello");
})

app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
})

const PORT =  process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`server at ${PORT}`);
})