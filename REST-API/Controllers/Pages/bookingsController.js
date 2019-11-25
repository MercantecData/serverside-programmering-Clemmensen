var url = require("url");
var handleError = require("../Errors/errorController.js").handleError;
var runSubPage = require("./_subPageController").runSubPage;

// Select sub api controller endpoints
exports.controller = (req, res, conn) => runSubPage(req, res, conn, apiSubQueries);

// Converts a time from server to the localtime to reflect UTC times at server correctly.
var utcTimeConvert = function (roomBookings) {
    roomBookings.forEach((booking) => {
        booking.StartTime = new Date(booking.StartTime).toLocaleString();
        booking.EndTime = new Date(booking.EndTime).toLocaleString();
    });
}

// Displays bookings based on query
//Call examples:
//http://localhost:8080/bookings?day=20
//http://localhost:8080/bookings?month=10
//http://localhost:8080/bookings?year=2018
//http://localhost:8080/bookings?day=20&year=2018&month=11&endDay=21&endMonth=11&endYear=2019
var displayBookings = {
    async run(req, res, conn) {
        var parsedUrl = url.parse(req.url, true);

        var startDay = parsedUrl.query["day"] ? parsedUrl.query["day"] : 0;
        var startMonth = parsedUrl.query["month"] ? parsedUrl.query["month"] : 0;
        var startYear = parsedUrl.query["year"] ? parsedUrl.query["year"] : 0;

        var endDay = parsedUrl.query["endDay"] ? parsedUrl.query["endDay"] : startDay;
        var endMonth = parsedUrl.query["endMonth"] ? parsedUrl.query["endMonth"] : startMonth;
        var endYear = parsedUrl.query["endYear"] ? parsedUrl.query["endYear"] : startYear;

        conn.query("CALL GetBookings(?, ?, ?, ?, ?, ?)", [startDay, startMonth, startYear, endDay, endMonth, endYear], (err, data) => {

            if (err) {
                if (err.code == "ER_SP_WRONG_NO_OF_ARGS") handleError(req, res, 2);
                else handleError(req, res, 1);
            }

            else {
                utcTimeConvert(data[0]);
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

            // TODO: Move to method checking whether database has entry conflicting
            var promiseResult = await new Promise((resolve, reject) => {
                conn.query("SELECT * FROM room_bookings WHERE RoomId = ?"
                    + " AND(StartTime <= ? AND EndTime > ?) OR (StartTime >= ? AND EndTime <= ?)",
                    [roomId, fromDateTime, fromDateTime, fromDateTime, toDateTime], (err, data) => {
                        if (!err) {
                            utcTimeConvert(data);
                            resolve(data);
                        }
                        else
                            reject(err);
                    });
            }).catch(err => {
                console.log(JSON.stringify(err));
            });

            
            if (promiseResult == undefined) handleError(req, res, 1);
            else {

                // Do not alllow booking if a reservation conflicts
                if (promiseResult.length > 0) {
                    handleError(req, res, 2, "{\"error\": \"Room is already booked, please change time to book\", " +
                        "\"conflicts\": " + JSON.stringify(promiseResult) + "} ");
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

var apiSubQueries = {
    ";GET": displayBookings,            /* "/bookings/" */
    "undefined;GET": displayBookings,   /* "/bookings" */
    "add;POST": addBooking              /* "/bookings/add" */
};