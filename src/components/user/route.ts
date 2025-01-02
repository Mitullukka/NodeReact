const express = require('express');
const { registerValidation } = require('../user/validation'); 
import validate from '../../utils/validate';
import permssionController from './permssionController';

import userController  from './userController'
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/get-profile', userController.getProfile);
router.post('/change-password', userController.changePassword);


router.post('/create', permssionController.create);
router.post('/question-create', userController.questionCreate);
router.post('/question-ans-create', userController.questionAnsCreate);
router.get('/get-option', userController.getOption);
router.post('/exam-submit', userController.submitExam);





module.exports = router;