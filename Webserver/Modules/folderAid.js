var fs = require("fs");

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

            // TODO: Do a better fix for identifying folders using fs
            if (file.indexOf(".") == -1) {
                file += "/";
            }

            directoryContent.fileEntities.push("<a href=\"" + file + "\" " +
                ((!file.endsWith("/") && !file.endsWith(".html")) ? "target=\"_blank\"" : "") +
                "> " + file + "</a > <br>");
        });
        callback(directoryContent);
    });
}
/*
exports.outputFolderContent = funtion(path, res, callback){
    exports.listFolderContent
    if (dir.error != null) {
        res.write("No folder content was found");
    } else {
        dir.fileEntities.forEach(fileLink => {
            res.write(fileLink);
        });
    }
}
outputFolderContent(wwwMain, (dir) => {

});*/