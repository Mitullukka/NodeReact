import mongoose, { model } from "mongoose";

const userSchema  = new mongoose.Schema({
    roleId:{
        type:mongoose.Types.ObjectId,
        ref: 'Role',
        require: true,
     },
    first_name:{
        type:String,
        rquired:true,
    },
    last_name:{
        type:String,
        rquired:true,
    },
    email:{
        type:String,
        rquired:true,
    },
    password:{
        type:String,
        rquired:true,
    },
    moile:{
        type:String,
        rquired:true,
    }
},{timestamps: true});


module.exports = mongoose.model('User',userSchema)
