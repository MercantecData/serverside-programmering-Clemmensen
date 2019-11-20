// Controllers for url end points
var apiPages = {
    "/rooms": require("./rooms"),
    "/bookings": require("./bookings")
}


// Look for controller for desired page
exports.handleQuery = (req, res, conn, callbackServer) => {

	// Check if page handler is defined
    if (!(req.url in apiPages)) {
        callbackServer(req, res, false);
    }
    else {
        apiPages[req.url].controller(req, res, conn, callbackServer);
    }
}