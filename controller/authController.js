const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


exports.registercontroller = async(req,res)=>{
    try {
        
        const {name, email, age, uniqueKey, password ,voter_ID, aadhar , area} = req.body;
        if(!name || !email || !age || !uniqueKey || !password || !voter_ID || !aadhar || !area  )
        {
            return res.status(304).send({
                success:false,
                message:"please enter all the fileds!!"
            })
        }

        const IsExistingUser = await userModel.findOne({voter_ID});
        const IsAadhar = await userModel.findOne({aadhar});
        if(IsExistingUser || IsAadhar )
        {
            return res.status(200).send({
                success:false,
                message:"user allready existing or May be incorrect Voter ID or Aadhar"
            })
        }

        const hashedPassword = await bcrypt.hash(password,6); 

        const newUser = new userModel({name, email, age, uniqueKey, password:hashedPassword, voter_ID, aadhar ,area});
        await newUser.save();

        return res.status(201).send({
            success:true,
            newUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in register callstack',
            error
        })
    }
}

exports.loginController = async(req,res)=>{
    try {
        const {voter_ID, email, password} = req.body;

        if(!voter_ID || !email || !password)
        {
            return res.status(400).send({
                success:false,
                message:"please enter all required filed!!"
            })
        }

        const user = await userModel.findOne({voter_ID});
        if(!user)
        {
            return res.status(200).send({
                success:false,
                message:"please register yourSelf with your voter ID"
            })
        }

        const CheckPassword = await bcrypt.compare(password,user.password);
        if(!CheckPassword)
        {
            return res.status(204).send({
                success:false,
                message:"password incorrect"
            })
        }

        const token = await jsonwebtoken.sign({_id:user.id},process.env.JWT_SECRET,{expiresIn: "7d"});

        return res.status(201).send({
            success:true,
            message:"login successfully",
            user:{
                name : user.name,
                email: user.email,
                age : user.age,
                voter_ID : user.voter_ID,
                area : user.area,
                aadhar : user.aadhar
            },
            token
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in login callstack',
            error
        })
    }
}

exports.forgotPasswordController = async(req,res)=>{
    try {
        const {email, uniqueKey, newPassword} = req.body;

        if( !email || !uniqueKey || !newPassword)
        {
            return res.status(400).send({
                success:false,
                message:"please enter required fileds",
            })
        }

        const user = await userModel.findOne({email, uniqueKey});

        if(!user)
        {
            return res.status(200).send({
                success:false,
                message:"invail email or uniqueKey"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword,6);

        await userModel.findByIdAndUpdate(user._id,{password:hashedPassword});
        
        return res.status(201).send({
            success:true,
            message:"pasword update successfully",
            user:{
                name:user.name,
                email:user.email,
                age:user.age
            }
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in forgot Password Controller callstack',
            error
        })
    }
}

exports.emailController = async(req, res) => {
    // Send the mail to the user
    const { userEmail, userName } = req.body;
    
    let config = {
          service : 'gmail',
          auth : {
                user : process.env.EMAIL,
                pass : process.env.PASSWORD 
          }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
          theme : "default",
          product : {
                name : "Election Commission of India",
                link : 'https://mailgen.js/'
          }
    })

    let response = {
          body : {
                name : userName,
                intro : "You have successfully voted",
                data : 
                [
                      {
                            item : "Voting",
                            description: "Thank you for giving your valuable vote"
                      }
                ],
                outro : "Looking forward to meet you on the result Day"
          }
    }

    let mail = MailGenerator.generate(response);

    let message = {
          from : process.env.EMAIL,
          to : userEmail,
          subject : "Voting Done",
          html : mail
    }

    transporter.sendMail(message).then(() => {
          return res.status(201).send({
                success : true,
                message : "Email Received"
          })
    }).catch(error => {
          return res.status(500).send({
                success : false,
                message : "Error while sending Email",
                error
          })
    })
}