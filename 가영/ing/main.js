var http = require("http");
var express = require("express");
var fs = require("fs");
// var mime = require('mime');

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + "/public"));
console.log(__dirname);

app.get("/", function (req, res) {
  fs.readFile("./index.html", (err, data) => {
    if (err) {
      response.send(err);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.send("<img src='/img/img.jpg' />");
      res.end(data);
    }
  });
});

server.listen(80, function () {
  console.log("sever 작동");
});

/*

const ip = require("ip");
const https = require("https");
const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/public"));
console.log(__dirname);

app.use("/", function (req, res) {
  fs.readFile("/index.html", (err, data) => {
    if (err) {
      response.send("에러");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.send("<img src='/img/img.jpg' />");
      res.end(data);
    }
  });
});
/*
const sslServer = https.createServer({
  key : fs.readFileSync(path.join(__dirname,"cert","key.pem")),
  cert: fs.readFileSync(path.join(__dirname,"cert","cert.pem"))
},app);

sslServer.listen(3443, function () {
  console.log('https://' + ip.address() + ':' + 443 + "| start time : "+new Date());
});
*/

// http.createServer(app).listen(80,function() {
//   console.log('서버 작동');
//   });

// https.createServer(option,app).listen(443, function () {
//   console.log('https://' + ip.address() + ':' + 3000+ "| start time : "+new Date());
// });
