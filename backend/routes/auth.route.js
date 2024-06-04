import express from "express";
import passport from "passport";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import { schemas, validateBody } from "../middlewares/validateData.js";
const authRouter = express.Router();
import upload from '../middlewares/multer.js'; 

authRouter.post("/register", upload.single('avatar'), validateBody(schemas.registerSchema), authController.register);
authRouter.post("/login", validateBody(schemas.loginSchema), passport.authenticate('local', { session: false }), authController.login);
authRouter.post("/logout", authMiddleware.verifyToken, authController.logout);

// login with google
authRouter.post("/google", passport.authenticate("google-plus-token", {session: false}), authController.authGoogle);

export default authRouter;