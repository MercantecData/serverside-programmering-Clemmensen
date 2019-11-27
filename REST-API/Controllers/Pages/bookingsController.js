var url = require("url");


var handleError = require("../Errors/errorController").handleError;
var runSubPage = require("./_subPageController").runSubPage;

var urlHelper = require("../../Helpers/urlHelper");
var requestHelper = require("../../Helpers/requestHelper");

// Select sub api controller endpoints
exports.controller = (req, res, conn) => runSubPage(req, res, conn, apiSubQueries);

// Displays bookings based on query
var displayBookings = {
    async run(req, res, conn) {

        var params = urlHelper.fetchUrlValues (req, {
            "day": 0, "month": 0, "year": 0,
            "endDay": "day", "endMonth": "month", "endYear": "year"
        });

        conn.query("CALL GetBookings(?, ?, ?, ?, ?, ?)",
            [params.day, params.month, params.year,
            params.endDay, params.endMonth, params.endYear], (err, data) => {

                if (err) {
                    if (err.code == "ER_SP_WRONG_NO_OF_ARGS") handleError(req, res, 2);
                    else handleError(req, res, 1);
                }

                else res.end(JSON.stringify(data));
            });
    }
};



const useBodyForPostRequest = true;
// Add a new booking to the system
// Call example - POST query (useBody false)
// url: http://localhost:8080/bookings/add?roomId=1&fromDateTime=2019-12-25T04:00:00.000Z&toDateTime=2019-12-25T09:00:00.000Z
// Call example - POST query (useBody true)
// url: http://localhost:8080/bookings/add
// body: {"roomId":5,"fromDateTime":"2019-12-25T04:00:00.000Z","toDateTime":"2019-12-25T09:00:00.000Z"}
var addBooking = {
    async run(req, res, conn) {

        var postData = {};

        if (useBodyForPostRequest) {
            var postReceivedData = await requestHelper.getPostBody(req, res);
            if (postData == undefined) return;

            // Transfer the received data (To avoid altering datatype from string to date)
            postData.roomId = postReceivedData.roomId;
            postData.fromDateTime = new Date(postReceivedData.fromDateTime);
            postData.toDateTime = new Date(postReceivedData.toDateTime);
        }

        else {
            var parsedUrl = url.parse(req.url, true);
            postData.roomId = parsedUrl.query["roomId"];
            postData.fromDateTime = new Date(parsedUrl.query["fromDateTime"]);
            postData.toDateTime = new Date(parsedUrl.query["toDateTime"]);
        }

        if (await isBookQueryOk(req, res, postData)) {

            var roomBookings = await getRoomBookings(conn, postData);

            if (roomBookings == undefined) handleError(req, res, 1);
            else {

                // Do not allow booking if a reservation conflicts
                if (roomBookings.length > 0) {
                    handleError(req, res, 2, {"error": "Room is already booked, please change time to book", "conflicts": roomBookings});
                    return;
                }

                conn.query("INSERT INTO room_bookings (room_id, start_time, end_time) VALUES (?, ?, ?)", [postData.roomId, postData.fromDateTime, postData.toDateTime], (err, result) => {

                    if (err) {
                        console.log(JSON.stringify(err));
                        if (err.code == "ER_SP_WRONG_NO_OF_ARGS") handleError(req, res, 2, "Please check that room, from and to date is all defined");
                        else if(err.code == "ER_NO_REFERENCED_ROW_2") handleError(req, res, 2, "Please verify that the selected room exists");
                        else handleError(req, res, 1);
                    }

                    res.end(JSON.stringify(result));
                });
            }
        }
    }
};


var isBookQueryOk = async (req, res, postData) => {

    var currentDateTime = new Date();

    if (postData.roomId == undefined || postData.roomId == "" || postData.fromDateTime == "Invalid Date" || postData.toDateTime == "Invalid Date") {
        handleError(req, res, 2, "Please check room number, from and to date.");
    }
    else if (currentDateTime > postData.fromDateTime || currentDateTime > postData.toDateTime) {
        handleError(req, res, 2, "Booking date must be after '" + currentDateTime + "'");
    }
    else if (postData.fromDateTime > postData.toDateTime) {
        handleError(req, res, 2, "End time of booking must be after start time of booking");
    }
    else return true;
    return false;
}


var getRoomBookings = async (conn, postData) => {
    return await new Promise((resolve, reject) => {
        conn.query("SELECT * FROM room_bookings WHERE room_id = ?"
            + " AND ((start_time <= ? AND end_time > ?) OR (start_time >= ? AND start_time <= ?))",
            [postData.roomId, postData.fromDateTime, postData.fromDateTime, postData.fromDateTime, postData.toDateTime],
            (err, data) => {
                if (!err) {
                    resolve(data);
                }
                else reject(err);
            });
    }).catch(err => {
        console.log(JSON.stringify(err));
    });
}


var apiSubQueries = {
    ";GET": displayBookings,            /* "/bookings/" */
    "undefined;GET": displayBookings,   /* "/bookings" */
    "add;POST": addBooking              /* "/bookings/add" */
};