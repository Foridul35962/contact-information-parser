import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()

import db from './src/db.connect.js';
import { parser } from './src/controllers/ai.controllers.js';
import arcjetProtection from './src/middleware/arjetCheck.js';
import errorHandler from './src/utils/ErrorHandler.js';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await db.one("SELECT 1 AS ok");
    return res.status(200).json({ status: "ok", database: "connected" });
  } catch (e) {
    return res.status(500).json({ status: "ok", database: "not connected", error: e.message });
  }
});

app.post('/parse', arcjetProtection, parser)


//global error handler
app.use(errorHandler)

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port} is running.`);
});
