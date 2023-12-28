const bcrypt=require("bcrypt");
const User=require("../models/User");
const jwt=require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config();
//const { use } = require("../routes/user");
exports.signup=async( req,res) =>{
    try{
        const {name, email, password, role}=req.body;
        const existUser=await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            });
        }
        let hashPassword;
        try{
            hashPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in incrypting message",
            });
        }
        const user=await User.create({
            name,email,password:hashPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User Created Successfully",
        });


    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be resister please sesister",
        });

    }
}

exports.login=async (req,res) =>{
    try{
        const {email,password}=req.body;
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:"Please fill all the detail carefully",
            });
        }
        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not resistered",
            })
        }

        const payload={
            email:user.email,
            id:user._id,
            role:user.role,
        };

        if(await bcrypt.compare(password,user.password)){
            let token=jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });
            user=user.toObject();
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User sign successfully",
            });
        }
        else{
            return  res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });

    }
}
