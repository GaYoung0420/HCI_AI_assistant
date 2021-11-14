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
