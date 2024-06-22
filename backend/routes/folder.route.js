import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import folderController from "../controllers/folder.controller.js";
const folderRouter = express.Router();

folderRouter.get("/", authMiddleware.verifyToken, folderController.getAll);
folderRouter.post("/", authMiddleware.verifyToken, folderController.create);
folderRouter.get("/:id", authMiddleware.verifyToken, folderController.getOne);
folderRouter.put("/:id", authMiddleware.verifyToken, folderController.update);
folderRouter.delete("/:id", authMiddleware.verifyToken, folderController.deleteFolder);
folderRouter.put("/add-course/:folderId/:courseId", authMiddleware.verifyToken, folderController.addCourse);
folderRouter.delete("/delete-course/:folderId/:courseId", authMiddleware.verifyToken, folderController.deleteCourse);
folderRouter.get("/list/:userId", authMiddleware.verifyToken, folderController.getList);
export default folderRouter;