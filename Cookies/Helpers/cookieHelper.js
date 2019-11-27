exports.getObject = (cookieString) => {

    var cookieObject = {"Info": []};

    var keyValuePairs = cookieString.split(/[;]/g);

    for (var keyValuePair of keyValuePairs) {

        // Split, but avoid using the cookie string entries that does not have one = sign between them
        var keyValuePairParts = keyValuePair.split(/[=]/g);

        if (keyValuePairParts.length == 2) {
            cookieObject[keyValuePairParts[0]] = keyValuePairParts[1];
        }

        else {
            // Save entries like "Secure" and HttpOnly in list below in Info array list
            // Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
            cookieObject["Info"].push(keyValuePair);
        }
    }
    
    return cookieObject;
}