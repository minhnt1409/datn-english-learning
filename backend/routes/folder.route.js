import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import folderController from "../controllers/folder.controller.js";
const folderRouter = express.Router();

folderRouter.get("/", authMiddleware.verifyToken, folderController.getAll);
folderRouter.get("/my/:userId", authMiddleware.verifyToken, folderController.getMyFolders);
folderRouter.get("/:id", authMiddleware.verifyToken, folderController.getOne);
folderRouter.post("/", authMiddleware.verifyToken, folderController.create);
folderRouter.put("/:id", authMiddleware.verifyToken, folderController.update);
folderRouter.delete("/:id", authMiddleware.verifyToken, folderController.deleteFolder);
folderRouter.get("/latest", authMiddleware.verifyToken, folderController.getLatestToOldest);
folderRouter.get("/oldest", authMiddleware.verifyToken, folderController.getOldestToNewest);
folderRouter.put("/add-course/:folderId/:courseId", authMiddleware.verifyToken, folderController.addCourse);
folderRouter.delete("/delete-course/:folderId/:courseId", authMiddleware.verifyToken, folderController.deleteCourse);

// get courses in a folder
folderRouter.get("/courses/:folderId", authMiddleware.verifyToken, folderController.getCoursesInFolder);
folderRouter.get("/list/:userId", authMiddleware.verifyToken, folderController.getList);
export default folderRouter;