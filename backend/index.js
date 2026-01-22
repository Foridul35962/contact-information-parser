import express from 'express';
import cors from 'cors';

import db from './src/db.connect';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    database: `${db ? 'connect' : 'not connect'}`,
  });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port} is running.`);
});
