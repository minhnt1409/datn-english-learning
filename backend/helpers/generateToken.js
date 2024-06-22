import jwt from "jsonwebtoken";
import { JWT_ACCESS_KEY, JWT_ACCESS_KEY_EXPIRE_TIME } from "./config-env.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_ACCESS_KEY,
    {
      expiresIn: JWT_ACCESS_KEY_EXPIRE_TIME,
    }
  );
};

export default {
  generateAccessToken,
}