exports.getObject = (cookieString) => {

    var cookieObject = { "NonValuePairEntries": [] };

    // No cookie check
    if (cookieString == undefined)
        return cookieObject;

    var cookieEntries = cookieString.split(/[;]/g);

    for (var cookieEntry of cookieEntries) {
        cookieEntry = cookieEntry.trim();

        // Split, but avoid using the cookie string entries that does not have one = sign between them
        var keyValuePair = cookieEntry.split(/[=]/g);

        if (keyValuePair.length == 2) {
            cookieObject[keyValuePair[0]] = keyValuePair[1].replace(/["]/g, escape('"'));
        }

        else {
            // Save unrecognized / possible faulty entries in "NonValuePairEntries" array list
            cookieObject["NonValuePairEntries"].push(cookieEntry);
        }
    }
    
    return cookieObject;
}