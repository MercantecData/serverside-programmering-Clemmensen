// Requires
var http = require("http");
var url = require("url");
var fs = require("fs");

// Module methods
var getContentType = require("./Modules/mimetypes").getContentTypeByExt;
var outputFolderContent = require("./Modules/folderAid").outputFolderContent;

// Configuration
var webserverPort = 8080;
var wwwMain = "./www";
var defaultPage = "index.html";


var server = http.createServer((req, res) => {
    var urlParsed = url.parse(req.url);
    var reqFile = wwwMain + urlParsed.pathname;

    // Frontpage that shows directory listing
    if (reqFile == "./www/") {
        res.setHeader("content-type", "text/html");

        res.write("<h1>Front page</h1>");
        outputFolderContent(wwwMain, res, () => {
            res.end();
        });
    }

    // SubPage for folder listings
    else if (reqFile.endsWith("/")) {
        subPage = reqFile + defaultPage;
        res.setHeader("content-type", getContentType(subPage.split(".").pop()));

        fs.exists(subPage, (exists) => {
            if (exists) {
                res.write(fs.readFileSync(subPage));

                outputFolderContent(reqFile, res, () => {
                    res.end();
                });
            }
            else {
                res.statusCode = 404;
                res.end();
            }
        });
    }


    else {
        fs.exists(reqFile, (exists) => {

            // Output file data
            if (exists) {
                res.setHeader("content-type", getContentType(reqFile.split(".").pop()));
                res.write(fs.readFileSync(reqFile));
            }

            // File  was not found
            else {
                res.statusCode = 404;
            }
            res.end();
        });
    }

}).listen(webserverPort);