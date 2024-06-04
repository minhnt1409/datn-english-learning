import express from "express";
import { PORT } from "./helpers/config-env.js";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./helpers/database.js";
import route from "./routes/index.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// db
connectDB();

// routers
route(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})