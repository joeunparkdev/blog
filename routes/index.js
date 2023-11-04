const express = require('express');
const app = express();
const port = 3000;

// 라우터 모듈 가져오기
const routes = require('./routes');

// 데이터베이스 연결 함수 호출
const connect = require('./schemas');
connect();

app.use(express.json());

// 정적 파일
app.use(express.static('public'));

// 라우팅 경로
app.use('/posts', routes.Post);
app.use('/comments', routes.Comment);

app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
});
