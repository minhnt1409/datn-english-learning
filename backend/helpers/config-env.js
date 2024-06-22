import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;
export const JWT_ACCESS_KEY_EXPIRE_TIME = process.env.JWT_ACCESS_KEY_EXPIRE_TIME;
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
export const JWT_REFRESH_KEY_EXPIRE_TIME = process.env.JWT_REFRESH_KEY_EXPIRE_TIME;
