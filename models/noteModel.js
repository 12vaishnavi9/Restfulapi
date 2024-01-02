import mongoose from "mongoose";

const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    },
    user_:{
        type:mongoose.ObjectId,
        ref:"users",
         required:true
    }
}, {timestamps:true})

export default mongoose.model('notes',noteSchema);