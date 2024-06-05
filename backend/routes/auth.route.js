import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import { schemas, validateBody } from "../middlewares/validateData.js";
const authRouter = express.Router();
import { passportLocal } from "../middlewares/passport.js";
import upload from '../middlewares/multer.js'; 

authRouter.post("/register", upload.single('avatar'), validateBody(schemas.registerSchema), authController.register);
authRouter.post("/login", validateBody(schemas.loginSchema), passportLocal.authenticate('local', { session: false }), authController.login);
authRouter.post("/logout", authMiddleware.verifyToken, authController.logout);

export default authRouter;