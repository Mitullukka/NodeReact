import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
   title:{
      type: String,
      required: true,
  },
  status: {
      type: Number,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
  },
}, { timestamps: true });



module.exports = mongoose.model('Question', questionSchema);