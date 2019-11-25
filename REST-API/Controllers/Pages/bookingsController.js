// TODO: Delete this later
var url = require("url");


var handleError = require("../Errors/errorController").handleError;
var runSubPage = require("./_subPageController").runSubPage;
var helper = require("../../Helpers/TimeAndUrlHelper");

// Select sub api controller endpoints
exports.controller = (req, res, conn) => runSubPage(req, res, conn, apiSubQueries);

// Displays bookings based on query
var displayBookings = {
    async run(req, res, conn) {

        var params = helper.fetchUrlValues (req, {
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

            else {
                helper.utcTimeConvert(data[0]);
                res.end(JSON.stringify(data));
            }
        });
    }
};

// Add a new booking to the system
// Call example - POST query
// url: http://localhost:8080/bookings/add?roomId=1&fromDateTime=2019-11-22 9:00&toDateTime=2019-11-22 10:00
// Convert to:
// url: http://localhost:8080/bookings/add
// body: {"roomId":5,"fromDateTime":"2019-11-22 9:00","toDateTime":"2019-11-22 10:00"}
var addBooking = {
    async run(req, res, conn) {
        var parsedUrl = url.parse(req.url, true);
        
        var roomId = parsedUrl.query["roomId"];
        var fromDateTime = new Date(parsedUrl.query["fromDateTime"]).toLocaleString();
        var toDateTime = new Date(parsedUrl.query["toDateTime"]).toLocaleString();

        var currentDateTime = new Date();


        // TODO: Move to method checking input
        if (roomId == undefined || fromDateTime == "Invalid Date" || toDateTime == "Invalid Date") {
            handleError(req, res, 2);
        }
        else if (currentDateTime > fromDateTime || currentDateTime > toDateTime) {
            handleError(req, res, 2, "Booking date must be after '" + currentDateTime + "'");
        }
        else if (fromDateTime > toDateTime) {
            handleError(req, res, 2, "End time of booking must be after start time of booking");
        }
        else {

            var roomBookings = await getRoomBookings(conn, roomId, fromDateTime, toDateTime);
                        
            if (roomBookings == undefined) handleError(req, res, 1);
            else {

                // Do not allow booking if a reservation conflicts
                if (roomBookings.length > 0) {
                    handleError(req, res, 2, "{\"error\": \"Room is already booked, please change time to book\", \"conflicts\": " + JSON.stringify(roomBookings) + "} ");
                    return;
                }

                conn.query("INSERT INTO room_bookings (RoomId, StartTime, EndTime) VALUES (?, ?, ?)", [roomId, fromDateTime, toDateTime], (err, result) => {

                    if (err) {
                        if (err.code == "ER_SP_WRONG_NO_OF_ARGS") handleError(req, res, 2);
                        else handleError(req, res, 1);
                    }

                    res.end(JSON.stringify(result));
                });
            }
        }
    }
};


var getRoomBookings = async (conn, roomId, fromDateTime, toDateTime) => {
    return await new Promise((resolve, reject) => {
        conn.query("SELECT * FROM room_bookings WHERE RoomId = ?"
            + " AND ((StartTime <= ? AND EndTime > ?) OR (StartTime >= ? AND EndTime <= ?))",
            [roomId, fromDateTime, fromDateTime, fromDateTime, toDateTime], (err, data) => {
                if (!err) {
                    helper.utcTimeConvert(data);
                    resolve(data);
                }
                else
                    reject(err);
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