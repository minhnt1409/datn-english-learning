import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import cardController from "../controllers/card.controller.js";
const cardRouter = express.Router();

cardRouter.get("/", authMiddleware.verifyToken, cardController.getAll);
cardRouter.get("/course/:courseId", authMiddleware.verifyToken, cardController.getCardsInCourse);
cardRouter.get("/:id", authMiddleware.verifyToken, cardController.getOne);
cardRouter.post("/", authMiddleware.verifyToken, cardController.create);
cardRouter.put("/:id", authMiddleware.verifyToken, cardController.update);
cardRouter.delete("/:id", authMiddleware.verifyToken, cardController.deleteCard);

export default cardRouter;