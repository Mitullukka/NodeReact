import { NextFunction, Request, Response } from "express"
const Joi = require('joi');

const registerValidation = Joi.object({
    first_name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(), 
});


export default {
    registerValidation
}    