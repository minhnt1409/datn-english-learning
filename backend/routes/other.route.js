import express from "express";
import { search } from "../controllers/other.controller.js";
const router = express.Router();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/search/:query", search);

router.get('/image/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send({ message: 'File not found' });
    }
  });
});

export default router;