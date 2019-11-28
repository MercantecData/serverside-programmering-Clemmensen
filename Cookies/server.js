var http = require("http");
var cookieHelper = require("./Helpers/cookieHelper")
var settingsServer = require("./settings").server;

http.createServer((req, res) => {
    res.setHeader("content-type", settingsServer.defaultContentType);

    var currentCookie = cookieHelper.getObject(req.headers["cookie"]);

    
    // Set some cookie values and set expire to UTC current time + 10 minutes

    var cookieAExpire = (new Date(Date.now() + 1000 * 60 * 60 * 1)).toUTCString();

    var newCookies = [
        "CookieValueA=Expires \"on " + cookieAExpire + "; Expires=" + cookieAExpire,
        "CookieValueB=Expires on browser close",
        "CookieValueC=Max-Age is " + settingsServer.cookieMaxAge + "; Max-Age=" + settingsServer.cookieMaxAge 
    ]

    res.setHeader("Set-Cookie", newCookies);

    res.write("{\"request-cookie\": " + JSON.stringify(currentCookie));
    res.write(",\"response-cookie\": \"" + newCookies.join(";").replace(/["]/g, escape('"')) + "\"");
    res.end("}");

}).listen(8080);