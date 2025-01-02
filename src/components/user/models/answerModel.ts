import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
questionId:{
    type:mongoose.Types.ObjectId,
    ref: 'Question',
    require: true,
},
answer:{
    type: String,
    required: true,
},
status: {
    type: Number,
    required: false,
    default: 1,
    comment: '0 is Deactive 1 is Active'
},
isCorrect: {
    type: Boolean,
    required: false,
    default: false,  
  }
}, { timestamps: true });



module.exports = mongoose.model('Answer', answerSchema);


