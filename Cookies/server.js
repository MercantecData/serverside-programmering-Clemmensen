var http = require("http");

http.createServer((req, res) => {
    res.setHeader("content-type", "text/html");
    res.setHeader("set-cookie", "This cookie will be set");
    res.end("<h1>Hello there</h1>");

}).listen(8080);