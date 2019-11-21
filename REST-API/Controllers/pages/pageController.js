    // Controllers for url end points
var apiPages = {
    "/rooms": require("./rooms"),
    "/bookings": require("./bookings")
}


// Look for controller for desired page
exports.handleQuery = (req, res, conn) => {

	// Check if main page handler is defined - using high url path selection
    var baseApiSelector = "/" + req.url.split("?")[0].split("/")[1];

    if (!(baseApiSelector in apiPages)) {
        console.log("404, " + req.url);
        res.statusCode = 404;
        res.end("{\"error\": \"Requested page was not found\"}");
    }
    else {
        apiPages[baseApiSelector].controller(req, res, conn);
    }
}