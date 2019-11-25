var handleError = require("../Errors/errorController.js").handleError;

// Controllers for url end points
var apiPages = {
    "/rooms": require("./roomsController"),
    "/bookings": require("./bookingsController")
}

// Look for controller for desired page
exports.handleQuery = (req, res, conn) => {

    // Check if main page handler is defined - using high url path selection
    var baseApiSelector = "/" + req.url.split("?")[0].split("/")[1];


    if (!(baseApiSelector in apiPages)) {
        handleError(req, res, 3, "Page '" + baseApiSelector + "' was not found as a valid endpoint");
    }
    else {
        apiPages[baseApiSelector].controller(req, res, conn);
    }
}