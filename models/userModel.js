import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            // remove whitespace
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        }
    },{timestamps:true}
)

export default mongoose.model('users',userSchema);