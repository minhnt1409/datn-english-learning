import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";
const userRouter = express.Router();

userRouter.get("/", authMiddleware.verifyToken, userController.getAll);
userRouter.get("/:id", authMiddleware.verifyToken, userController.getOne);
userRouter.put("/:id", authMiddleware.verifyToken, userController.update);
userRouter.delete("/:id", authMiddleware.verifyToken, userController.deleteUser);

export default userRouter;