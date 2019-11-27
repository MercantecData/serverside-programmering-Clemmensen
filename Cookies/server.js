var http = require("http");

http.createServer((req, res) => {
    res.setHeader("content-type", "text/html");
    res.setHeader("Set-Cookie", ["initialMessage=This cookie will be set", "secondaryMessage=also set"]);

    res.end("<h1>Hello there</h1>");

}).listen(8080);