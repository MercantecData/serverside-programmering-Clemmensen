var handleError = require("../Errors/errorController.js").handleError;
var runSubPage = require("./_subPageController").runSubPage;

// Select sub api controller endpoints
exports.controller = (req, res, conn) => runSubPage(req, res, conn, apiSubQueries);

var displayRooms = {
    run(req, res, conn, callbackServer) {
        conn.query("SELECT * FROM rooms", (err, data) => {
            if (err) handleError(req, res, 1);
            else res.end(JSON.stringify(data));
        });
    }
}

var apiSubQueries = {
    ";GET": displayRooms,            /* "/rooms/" */
    "undefined;GET": displayRooms,   /* "/rooms" */
};