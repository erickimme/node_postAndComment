import express from 'express';
import connect from './schemas/index.js';
import { postsRouter, commentsRouter } from './routes/index.js';

const app = express();
const PORT = 3000;
connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./assets'));

const router = express.Router();
app.use('/api', [router, postsRouter, commentsRouter]);

// 서버 에러 처리
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('서버 에러!');
});

// 404 처리 미들웨어
app.use((req, res, next) => {
  res.status(404).send('404 NOT FOUND');
});

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});