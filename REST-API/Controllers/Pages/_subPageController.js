var handleError = require("../Errors/errorController.js").handleError;

// Select sub api controller endpoints
exports.runSubPage = (req, res, conn, apiSubQueries) => {
    var subApiSelector = req.url.split("?")[0].split("/")[2] + ";" + req.method;

    if (!(subApiSelector in apiSubQueries)) handleError(req, res, 3, "Page '" + subApiSelector + "' was not found as a valid endpoint");
    else apiSubQueries[subApiSelector].run(req, res, conn);
}