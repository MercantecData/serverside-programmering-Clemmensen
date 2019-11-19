// Not complete list - but example if not using mimetype module
var extToContentTypes = {
    "html": "text/html",
    "htm": "text/html",
    "txt": "text/plain",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "js": "application/javascript",
    "css": "text/css",
    "ico": "image/x-icon"
};


exports.getContentTypeByExt = function (fileExt) {
    return extToContentTypes[fileExt];
}