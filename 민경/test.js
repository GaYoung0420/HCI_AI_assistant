/* 설치한 express 모듈 불러오기*/
const express = require("express");
/* Node.js 기본 내장 모듈 불러오기*/
const fs = require("fs");
/* express 객체 생성*/
const app = express();

app.use(express.static("views"));

app.get("/", function (request, response) {
  fs.readFile("./test.html", function (err, data) {
    if (err) {
      response.send("에러");
    } else {
      response.status(200).sendFile(__dirname + "/index.html");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
});
/* 서버를 80 포트로 listen */
app.listen(80, function () {
  console.log("서버시작");
});
