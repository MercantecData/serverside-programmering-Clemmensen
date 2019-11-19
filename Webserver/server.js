// Requires
var http = require("http");
var url = require("url");
var fs = require("fs");


// Configuration
var webserverPort = 8080;
var wwwMain = ".\\www";
var defaultPage = "index.html";


var server = http.createServer((req, res) => {
    console.log("--- Request start ---");
    console.log("Req url: '" + req.url + "'");


    var urlParsed = url.parse(req.url);
    var reqFile = wwwMain + urlParsed.pathname.replace("/", "\\");
    console.log("Req file: '" + reqFile + "'");



    // Frontpage
    if (req.url == "/") {
        res.setHeader("content-type", "text/html")
        fs.readdir(wwwMain, (err, files) => {
            files.forEach(file => {

                res.write("<a href=\"" + file + "\" target=\"_blank\">" + file + "</a><br>");

            });
            res.end();
        });
    }

    // SubPage for folder listings
    if (reqFile.endsWith("\\"){

        res.end();
    }





    else {
//        var fileRequested = fs.existsSync()
        //      if()

        res.end();
    }
});


server.listen(webserverPort, () => {
    console.log("Listening on machine at port " + webserverPort);
});