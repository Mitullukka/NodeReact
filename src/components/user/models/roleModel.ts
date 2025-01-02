import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
   name:{
      type: String,
      required: true,
  },
  permission:{
      type:Object,
      required: true,
  },
  status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  },
}, { timestamps: true });



module.exports = mongoose.model('Role', roleSchema);