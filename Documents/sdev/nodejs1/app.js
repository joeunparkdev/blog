const express = require('express');
const app = express();
const port = 3000;

// 라우터 모듈 가져오기
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');

// 데이터베이스 연결 함수 호출
const connect = require('./schemas');
connect();

app.use(express.json());

// 라우팅 경로
app.use('/', [postRouter,commentRouter] );

app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
});
