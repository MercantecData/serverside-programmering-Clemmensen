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
    var reqFile = wwwMain + urlParsed.pathname.replace(/[/]/g, "\\");
    console.log("Req file: '" + reqFile + "'");



    // Frontpage that shows directory listing
    if (reqFile == ".\\www\\") {
        res.setHeader("content-type", "text/html");


        // TODO: Move to method showing folder content
        fs.readdir(wwwMain, (err, files) => {
            res.write("Folder content:<br>")
            files.forEach(file => {

                // TODO: Do a better fix for identifying folders using fs
                if (file.indexOf(".") == -1) {
                    file += "/";
                }

                res.write("<a href=\"" + file + "\" " +
                    ((!file.endsWith("/") && !file.endsWith(".html")) ? "target=\"_blank\"" : "") +
                    "> " + file + "</a > <br>");
        });
        res.end();
    });
}

// SubPage for folder listings
    else if (reqFile.endsWith("\\")) {
        res.setHeader("content-type", "text/html");

        subPage = reqFile + defaultPage;
        fs.exists(subPage, (exists) => {

            if (exists) {
                res.write("\"" + subPage + "\" contents:");
                res.write(fs.readFileSync(subPage));
            }
            else {
                res.statusCode = 404;
            }
            res.end();
        });
    }

    // Not found
    else {

        fs.exists(reqFile, (exists) => {

            if (exists) {
                res.write(fs.readFileSync(reqFile));
            }
            else {
                res.statusCode = 404;
            }
            res.end();
        });
    }
}).listen(webserverPort);