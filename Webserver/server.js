// Requires
var http = require("http");
var url = require("url");
var fs = require("fs");

// Module methods
var getContentType = require("./Modules/mimetypes").getContentTypeByExt;
var listFolderContent = require("./Modules/folderAid").listFolderContent;

// Configuration
var webserverPort = 8080;
var wwwMain = ".\\www";
var defaultPage = "index.html";


var server = http.createServer((req, res) => {
    var urlParsed = url.parse(req.url);
    var reqFile = wwwMain + urlParsed.pathname.replace(/[/]/g, "\\");

    // Frontpage that shows directory listing
    if (reqFile == ".\\www\\") {
        res.setHeader("content-type", "text/html");

        listFolderContent(wwwMain, (dir) => {
            
            if (dir.error != null) {
                res.write("No folder content was found");
                res.end();
            } else {
                dir.fileEntities.forEach(fileLink => {
                    res.write(fileLink);
                });
                res.end();
            }
        });
    }

    // SubPage for folder listings
    else if (reqFile.endsWith("\\")) {
        subPage = reqFile + defaultPage;

        res.setHeader("content-type", getContentType(subPage.split(".").pop()));
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