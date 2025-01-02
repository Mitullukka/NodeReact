import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';

const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((err) => err.message),
      });
    }

    next();
  };
};

export default validate;
