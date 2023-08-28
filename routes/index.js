// /app.js
import express from 'express';

const router = express.Router();
const app = express();
const PORT = 3000;

app.use('/api', [router]);

export default router;