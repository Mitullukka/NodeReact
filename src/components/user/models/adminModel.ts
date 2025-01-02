import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
   roleId:{
      type:mongoose.Types.ObjectId,
      ref: 'Role',
      require: true,
   },
   name: {
      type: String,
   },
   email: {
      type: String,
      require: false,
      unique: true,
      lowercase: true,
      trim: true,
   },
   profile: {
      type: String,
      require: false,
   },
   password: {
      type: String,
      require: false
   },
   status: {
      type: Boolean,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
   },
}, { timestamps: true });



module.exports = mongoose.model('Admin', adminSchema);