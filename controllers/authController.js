import userModel from "../models/userModel.js";
import { hashPassword,comparePassword } from "../helpers/authHelper.js";
import Jwt from "jsonwebtoken";

export const registerController=async(req,res)=>{
    try{
        const {name,email,password,answer}=req.body
        if(!name){
            return res.send({message:"Name is Required"})
        }
        if(!email){
            return res.send({message:"Email is Required"})
        }
        if(!password){
            return res.send({message:"Password is Required"})
        }
        if(!answer){
            return res.send({message:"Favourite Movie is Required"})
        }
        const checkUser=await userModel.findOne({email});
        if(checkUser){
            return res.status(200).send({
                success:false,
                message:"Already registered please login!",
            })
        }
        const hashedPassword=await hashPassword(password);
        const user=await new userModel({name,email,password:hashedPassword,answer}).save()//same values as in schema
        res.status(201).send({
            success:true,
            message:"User Registered Successfully",
            user
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            err
        })
    }
}

export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Incorrect Password"
            })
        }
    const token=await Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).send({
        success:true,
        message:"Login successfully",
        user:{
            name:user.name,
            email:user.email,
        },
        token
    })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Error in login",
            err
        })
    }
}


export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
     return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New Password is required" });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
