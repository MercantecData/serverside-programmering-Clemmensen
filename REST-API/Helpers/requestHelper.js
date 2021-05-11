var handleError = require("../Controllers/Errors/errorController").handleError;

exports.getPostBodyJSON = async (req, res) => {
    var bodyData = "";
    
    req.on("data", data => {
        bodyData += data.toString();
    })

    return await new Promise((resolve, reject) => {
        req.on("end", () => {
            if (isBodyJSON(bodyData)) resolve(JSON.parse(bodyData));
            else {
                var bodyObject = convertBodyToJson(bodyData);
                if (bodyObject != undefined)
                    resolve(bodyObject);

                else reject(bodyData);
            }
        });
    }).catch(err => {
        handleError(req, res, 2, "Please check the inputted posted data");
    });
}

var isBodyJSON = (bodyData) => {
    var isTheBodyJson = true;
    try {
        JSON.parse(bodyData);
    }
    catch {
        isTheBodyJson = false;
    }
    return isTheBodyJson;
}

var convertBodyToJson = (bodyData) => {
    bodyData = unescape(bodyData.replace(/[+]/g, " "));

    var bodyObject = {};
    var bodyDataParts = bodyData.split(/[&]/g);
    for (var bodyDataPart of bodyDataParts) {
        var keyValuePair = bodyDataPart.split("=");

        // Ignore attributes where = does not occur or occurs multiple times in an entry
        if (keyValuePair.length != 2)
            continue;

        bodyObject[keyValuePair[0]] = keyValuePair[1];
    }

    if (Object.keys(bodyObject) == 0)
        return undefined;
    else return bodyObject;
} 