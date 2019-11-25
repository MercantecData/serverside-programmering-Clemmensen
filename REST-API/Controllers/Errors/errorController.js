var errorIdTypes = {
    1: {
        statusCode: 500,
        logToConsole: true,
        errorText: "An error occured on the server, please retry or contact support if it continues to occur."
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
        console.error("\t- Request url was: '" + req.url + "', error details: " + (errorDetails ? errorDetails : ""));
        errorId = 1;
    }

    else if (errorIdTypes[errorId].logToConsole) {
        console.error(errorIdTypes[errorId].statusCode + ", request caused at url: '"
            + req.url + "',\n\t- error details: " + (errorDetails ? errorDetails : ""));
    }    

    res.end("{"
        + "\"Result\": \"Error\","
        + "\"InternalErrorId\": " + errorId + ","
        + "\"Reason\": \"" + errorIdTypes[errorId].errorText + "\","
        + "\"Details\": " + (errorDetails ? errorDetails: "") + ","
        + "\"Data\": {}"
    +"}");
}