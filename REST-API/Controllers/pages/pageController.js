    // Controllers for url end points
var apiPages = {
    "/rooms": require("./rooms"),
    "/bookings": require("./bookings")
}


// Look for controller for desired page
exports.handleQuery = (req, res, conn, callbackServer) => {

	// Check if main page handler is defined - using high url path selection
    var baseApiSelector = "/" + req.url.split("?")[0].split("/")[1];

    if (!(baseApiSelector in apiPages)) {
        callbackServer(req, res, false);
    }
    else {
        res.setHeader("content-type", "text/json");
        apiPages[baseApiSelector].controller(req, res, conn, callbackServer);
    }
}