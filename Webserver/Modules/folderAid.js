var fs = require("fs");
var url = require("url");

exports.listFolderContent = function (path, callback) {
    var directoryContent = {};
    directoryContent.fileEntities = [];

    fs.readdir(path, (err, files) => {

        directoryContent.error = err;

        if (err != null) {
            callback(directoryContent);
            return;
        }

        files.forEach(file => {
            var localFileEntry = decodeURIComponent(url.pathToFileURL(path + "/" + file).pathname.substr(1));
            if(fs.lstatSync(localFileEntry).isDirectory()){
                file += "/";
            }

            directoryContent.fileEntities.push("<a href=\"" + file + "\" " +
                ((!file.endsWith("/") && !file.endsWith(".html")) ? "target=\"_blank\"" : "") +
                "> " + file + "</a > <br>");
        });
        callback(directoryContent);
    });
}

exports.outputFolderContent = function (path, res, callback) {
    res.write("Folder contents:<br>");

    exports.listFolderContent(path, (dir) => {
        if (dir.error != null) {
            res.write("No folder content was found");
        } else {
            dir.fileEntities.forEach(fileLink => {
                res.write(fileLink);
            });
        }
        callback();
    });
}