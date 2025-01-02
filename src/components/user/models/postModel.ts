import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },       
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    }, 
},{timestamps:true})

module.exports = mongoose.model('Post',postSchema)