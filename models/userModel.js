const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name : {
            type:String,
            require:[true,"name is require"]
        },
        voter_ID:{
            type:String,
            require:[true,"email is require"],
            // unique:true
        },
        aadhar:{
            type:String,
            require:[true,"email is require"],
            // unique:true
        },
        email : {
            type:String,
            require:[true,"email is require"],
           
        },
        password : {
            type:String,
            require:[true,"password is require"]
        },
        uniqueKey : {
            type:String,
            require:[true,"uniqueKey is require"]
        },
        age : {
            type:Number,
            require:[true,"age is require"]
        },
       
        area:{
            type : String,
            require:[true,"constituency is require"]
        }
        

    },
    {
        timestamps : true
    }
)

const userModel = mongoose.model("user",UserSchema);
module.exports = userModel;