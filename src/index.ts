import mongoose from "mongoose";
import RedisClient from "./utils/redisHelper";
import cors from "cors"
const morgan = require('morgan');
const config = require("config");

const express = require('express')
const userRouter = require("./components/user/route");

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST', 
    allowedHeaders: 'Content-Type,Authorization', 
  }))

app.use(express.json());
app.use(morgan('dev'))

app.use("/api/user", userRouter);



const PORT = 8000;

app.listen(PORT,()=>{
    console.log(`[NodeJs server]: Server is running at http://localhost:${PORT}`)
    mongoose.connect(config.get("DB_CONN_STRING")).then(()=>console.log('mongoose connected')).catch((err)=>console.log(err));
    RedisClient.on('error',(err:any)=>console.log('Redis Client error',err))
})