
import { Request, Response } from "express";
import RedisClient from "../../utils/redisHelper";
const bcrypt = require("bcryptjs")
import * as Jwt from 'jsonwebtoken'
const config = require("config");
import mongoose from "mongoose";
const User = require('../user/models/userModel')
const Post = require('../user/models/postModel')
const Permission = require('../user/models/permissionModel')
const Role = require('../user/models/roleModel')
const Question = require('../user/models/questionModel')
const Answer = require('../user/models/answerModel')
const UserExam = require('../user/models/userExamModel')

import multer from "multer"
import { FileFilterCallback } from 'multer'
import path from "path";
const _ = require('underscore')

async function register(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password, mobile } = req.body;
  
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(409).json({ message: "Email already exists" });
      }
  
      if (req.body.type && req.body.type == 'super_admin') {
        await Permission.deleteMany({});
        await Role.deleteMany({});
  
        await Permission.insertMany([
          { name: 'user' },
          { name: 'main_category' },
        ]);
  
        let permission: any = {};
        let permissionNames = await Permission.find({ status: true }).select("name");
        let pnames = _.pluck(permissionNames, "name");
  
        pnames.forEach((element: any) => {
          permission[element] = "11111";
        });
  
        let role = await new Role({
          name: "Super Admin",
          permission: permission
        });
  
        const roleId = await role.save();
  
        req.body.roleId = roleId._id;
      }
  
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        mobile,
      });
  
      await newUser.save();
  
      const accessToken = Jwt.sign({ id: newUser._id, email: newUser.email }, config.get("JWT_ACCESS_TOKEN"), { expiresIn: "1h" });
  
      const redisKey = `${newUser._id.toString()}`;
      const otp = 111111; 
      await RedisClient.set(redisKey, JSON.stringify({
        createdAt: Date.now(),
        accessToken: accessToken,
        userData: newUser,
        otp: otp,
        verify: false,
      }));
  
      res.status(201).json({ message: "User registered successfully", user: newUser, accessToken });
  
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error during registration" });
    }
  }




async function login(req:Request,res:Response){
    try{
        const { email,password} = req.body;

        const user = await User.findOne({email:email});

        if (!(user && (await bcrypt.compare(password, user.password)))) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const accessToken = Jwt.sign({ id: user._id, email: user.email }, config.get("JWT_ACCESS_TOKEN"), { expiresIn: "1h" } );

        const refreshToken = Jwt.sign({ id: user._id, email: user.email },config.get("JWT_REFRESH_TOKEN"), { expiresIn: "7d" } );

        const redisKey = `${user._id.toString()}`; 

        await RedisClient.set(redisKey, JSON.stringify({
            createdAt: Date.now(),
            accessToken: accessToken,
            userData: user,
            verify: false,
        }));

        // const valid_password = await bcrypt.compare(
        //     req.body.password,
        //     user.password
        // )

        // if(!valid_password){
        //     return res.status(404).json({ message: "Invalid password" });
        // }

        return res.status(200).json({ message: "Login Successfully", data: user,accessToken,refreshToken });
    }catch(e){

    }
} 


async function getProfile(req:Request,res:Response){
    try{
        const token:any = req.headers.authorization?.split(' ')[1]; 
        const decoded = Jwt.verify(token, config.get('JWT_ACCESS_TOKEN')) as { id: string };
        const userId = decoded.id
    
        const user = await User.find({_id:userId});
        return res.status(200).json({ user });

    }catch(e){
        console.log(e);        
    }
}

async function changePassword(req:Request,res:Response){
    try{
        const { current_password,new_password } = req.body;  

        const token:any = req.headers.authorization?.split(' ')[1]; 
        const decoded = Jwt.verify(token, config.get('JWT_ACCESS_TOKEN')) as { id: string };
        const userId = decoded.id

        const user = await User.findById(userId)

        const valid_password = await bcrypt.compare(current_password,user.password)

        if(!valid_password){
            return res.status(500).json({ message:"Current Password wrong" });
        }

        const salt=10;
        user.password = await bcrypt.hash(new_password,salt);
        await user.save();

        return res.status(200).json({ message:"Password Change" });

    }catch(e){
        console.log(e);        
    }
}


 async function questionCreate(req: Request, res: Response) {
  try {
    const { title } = req.body;

    const question = new Question({ title });
    await question.save();

    return res.status(201).json({
      message: "Question created successfully.",
      question,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

 async function questionAnsCreate(req: Request, res: Response) {
    try {
      const { questionId, answer,isCorrect } = req.body;
     
      const questionExists = await Question.findById(questionId);
      if (!questionExists) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      const answerDoc = new Answer({
        questionId,
        answer,
        isCorrect
      });
      const savedAnswer = await answerDoc.save();
  
      return res.status(201).json({message: "Answer created successfully.",answer: savedAnswer});
    } catch (error) {
      console.error("Error creating answer:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

   async function getOption(req: Request, res: Response) {
    try {
      const options = await Question.aggregate([
        {
          $lookup: {
            from: "answers",
            localField: "_id", 
            foreignField: "questionId", 
            as: "options", 
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            status: 1,
            options: {
              answer: 1,
              isCorrect: 1,
            },
          },
        },
      ]);
  
      return res.status(200).json({ questions: options });
    } catch (error) {
      console.error("Error fetching options:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }


   async function submitExam(req: Request, res: Response) {
    try {
      const { userId, responses } = req.body; 
  
      let totalQuestions = 0;
      let correctAnswers = 0;
  
      const results = [];
  
      for (const response of responses) {
        const { questionId, selectedAnswer } = response;
  
        const correctAnswer = await Answer.findOne({
          questionId: questionId,
          isCorrect: true,
        });
  
        if (!correctAnswer) {
          return res.status(404).json({ message: `Question ${questionId} or answer not found.` });
        }
  
        const isCorrect = correctAnswer.answer === selectedAnswer;
  
        if (isCorrect) correctAnswers++;
  
        totalQuestions++;
  
        const userExam = new UserExam({
          userId,
          questionId,
          selectedAnswer,
          isCorrect,
        });
        await userExam.save();
  
        results.push({
          questionId,
          selectedAnswer,
          isCorrect,
        });
      }
  
      const scorePercentage = (correctAnswers / totalQuestions) * 100;
      const pass = scorePercentage >= 50;
      const remark = pass ? "Pass" : "Fail";
  
      return res.status(201).json({
        message: "Exam submitted successfully.",
        results,
        totalQuestions,
        correctAnswers,
        scorePercentage: scorePercentage.toFixed(2),
        remark,
      });
    } catch (error) {
      console.error("Error submitting exam:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

export default {
    register,
    login,
    getProfile,
    changePassword,
    questionCreate,
    questionAnsCreate,
    getOption,
    submitExam
}