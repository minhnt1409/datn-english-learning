import jwt from "jsonwebtoken";
import { JWT_ACCESS_KEY } from "../helpers/config-env.js";

export const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const token = req.headers["authorization"];
    const accessToken = token && token.split(" ")[1];

    if (!accessToken) return res.status(404).json({ message: "token not found" });

    try {
      const payload = await jwt.verify(
        accessToken,
        JWT_ACCESS_KEY
      );
      req.payload = payload;
      next();
    } catch (error) {
      return res.status(500).json({ message: error });
    }

  },

  verifyAdmin: async (req, res, next) => {
    const token = req.headers["authorization"];
    const accessToken = token && token.split(" ")[1];

    if (!accessToken) return res.status(404).json({ message: "token not found" });

    const verified = await jwt.verify(
      accessToken,
      JWT_ACCESS_KEY
    );

    if (verified && verified.role === "admin") {
      next();
    } else return res.status(403).json({ message: "Only admin allowed!" })
  }
}