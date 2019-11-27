var http = require("http");
var cookieHelper = require("./Helpers/cookieHelper")

http.createServer((req, res) => {
    res.setHeader("content-type", "text/json");

    var currentCookie = cookieHelper.getObject(req.headers["cookie"]);

    var newCookie = ["initialMessage=This cookie will be set", "cookieWasSetAt=" + new Date()]
    res.setHeader("Set-Cookie", newCookie);
    console.log(req.headers["cookie"]);

    res.write("{\"request-cookie\": \"" + currentCookie + "\"");
    res.write(",\"response-cookie\": \"" + newCookie.join(";") + "\"");
    res.end("}");

}).listen(8080);