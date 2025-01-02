import mongoose from "mongoose";

const userExamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questionId: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("UserExam", userExamSchema);
