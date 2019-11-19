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

    // index.html (main) pages
    if (reqFile.endsWith("/") || reqFile.endsWith("/" + defaultPage)) {

        // Set the requested page to subfolder to allow combined transversal of folder content
        if (reqFile.endsWith("/" + defaultPage))
            reqFile = reqFile.substring(0, reqFile.indexOf("/" + defaultPage)+1);

        var indexPage = reqFile + defaultPage;
        res.setHeader("content-type", getContentType(indexPage.split(".").pop()));

        fs.exists(indexPage, (exists) => {
            if (exists) {
                res.write(fs.readFileSync("./design/header.html"));
                res.write(fs.readFileSync(indexPage));

                outputFolderContent(reqFile, res, () => {
                    res.write(fs.readFileSync("./design/footer.html"));
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