var url = require("url");

// Fetches the desired query paramaters, but also
// allows another value to act as a fallback value*
// Example if endDay for "endDay": "startDay" does not exist
// -> then use fetched value for startDay if it exists as requestedParams     
exports.fetchUrlValues = function (req, requestedParams) {
    var parsedUrl = url.parse(req.url, true);

    requestedKeys = Object.keys(requestedParams);
    requestedKeys.forEach(requestedKey => {

        if (parsedUrl.query[requestedKey]) {

            // Check whether a number is expected and try to parse as number if possible or assign 0 if not
            if (typeof requestedParams[requestedKey] == 'number'
                || typeof requestedParams[requestedParams[requestedKey]] == 'number') {
                requestedParams[requestedKey] = isNaN(parsedUrl.query[requestedKey]) ?
                    0 : parseInt(parsedUrl.query[requestedKey]);
            }
            else requestedParams[requestedKey] = parsedUrl.query[requestedKey];
        }

        // *Use a fallback key to get the value needed
        else if (requestedKeys.indexOf(requestedParams[requestedKey]) > -1) {
            requestedParams[requestedKey] = requestedParams[requestedParams[requestedKey]];
        }
    });

    return requestedParams;
}