// Controllers for url end points
var apiPages = {
    "/rooms": require("./rooms"),
    "/bookings": require("./bookings")
}


// Look for controller for desired page
exports.handleQuery = (req, res, conn, callbackServer) => {

	// Check if page handler is defined
    var baseUrl = req.url.split("?")[0];

    if (!(baseUrl in apiPages)) {
        callbackServer(req, res, false);
    }
    else {
        res.setHeader("content-type", "text/json");
        apiPages[baseUrl].controller(req, res, conn, callbackServer);
    }
}