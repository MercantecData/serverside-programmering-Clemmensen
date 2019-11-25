var errorIdTypes = {
    1: {
        statusCode: 500,
        logToConsole: true,
        errorText: "A critical error occured on the server, please retry or contact support if it continues to occur."
    },
    2: {
        statusCode: 400,
        logToConsole: true,
        errorText: "The request / parameters supplied did not work for this ressource."
    },
    3: {
        statusCode: 404,
        logToConsole: false,
        errorText: "The requested resource was not found."
    }
};

exports.handleError = (req, res, errorId, errorDetails) => {

    if (errorIdTypes[errorId] == undefined) {
        console.error("A critical error occured, the errorId of '" + errorId + "' did not exist."
            + "Please check the programming of the rest server");
        console.error("\t- Request url was: " + req.url);
        errorId = 1;
    }

    else if (errorIdTypes[errorId].logToConsole) {
        console.error("\t" + errorIdTypes[errorId].statusCode + ", request cause: '" + req.url + "'");
    }    

    res.end("{"
        + "\"Result\": \"Error\","
        + "\"ErrorId\": " + errorId + ","
        + "\"Reason\": \"" + errorIdTypes[errorId].errorText + "\","
        + "\"Details\": " + JSON.stringify(errorDetails) + ","
        + "\"Data\": {}"
    +"}");
}