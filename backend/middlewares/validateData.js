import joi from "joi";

export const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);

    if(validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if(!req) req = {};
      if(!req['params']) req.params = {};

      req.body = validatorResult.value;
      next();
    }
  }
};

export const schemas = {
  registerSchema: joi.object().keys({
    username: joi.string().min(5).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  }),

  loginSchema: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })
}