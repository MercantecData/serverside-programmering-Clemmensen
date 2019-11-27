var handleError = require("../Controllers/Errors/errorController").handleError;

exports.getPostBody = async (req, res) => {

    var bodyData = "";
    
    req.on("data", data => {
        bodyData += data.toString();
    })

    return await new Promise((resolve, reject) => {
        req.on("end", () => {
            try {
                var bodyDataObject = JSON.parse(bodyData);
                resolve(JSON.parse(bodyData));
            }
            catch(err){
                reject(err);
            }
        });
    }).catch(err => {
        handleError(req, res, 2, "Please check the inputted posted json data");
    });
}