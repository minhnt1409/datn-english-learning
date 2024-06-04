import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import courseController from "../controllers/course.controller.js";
const courseRouter = express.Router();

courseRouter.get("/", authMiddleware.verifyToken, courseController.getAll);
courseRouter.get("/my/:userId", authMiddleware.verifyToken, courseController.getMyCourses);
courseRouter.get("/latest", authMiddleware.verifyToken, courseController.getLatestToOldest);
courseRouter.get("/oldest", authMiddleware.verifyToken, courseController.getOldestToNewest);
courseRouter.get("/:id", authMiddleware.verifyToken, courseController.getOne);
courseRouter.post("/", authMiddleware.verifyToken, courseController.create);
courseRouter.put("/:id", authMiddleware.verifyToken, courseController.update);
courseRouter.delete("/:id", authMiddleware.verifyToken, courseController.deleteCourse);
courseRouter.get("/list/:userId", authMiddleware.verifyToken, courseController.getList);
export default courseRouter;