var url = require("url");

// Select sub api controller endpoints
exports.controller = (req, res, conn) => {
    var subApiSelector = req.url.split("?")[0].split("/")[2] + ";" + req.method;

    if (!(subApiSelector in apiSubQueries)) {
        console.log("404, " + req.url);
        res.statusCode = 404;
        res.end("{\"error\": \"Requested page was not found\"}");
    }
    else {
        apiSubQueries[subApiSelector].run(req, res, conn);
    }
}

// Displays bookings based on query
//Call examples:
//http://localhost:8080/bookings?day=20
//http://localhost:8080/bookings?month=10
//http://localhost:8080/bookings?year=2018
//http://localhost:8080/bookings?day=20&year=2018&month=11&endDay=21&endMonth=11&endYear=2019
var displayBookings = {
    run(req, res, conn) {
        var parsedUrl = url.parse(req.url, true);

        console.log(parsedUrl);

        var startDay = parsedUrl.query["day"] ? parsedUrl.query["day"] : 0;
        var startMonth = parsedUrl.query["month"] ? parsedUrl.query["month"] : 0;
        var startYear = parsedUrl.query["year"] ? parsedUrl.query["year"] : 0;

        var endDay = parsedUrl.query["endDay"] ? parsedUrl.query["endDay"] : startDay;
        var endMonth = parsedUrl.query["endMonth"] ? parsedUrl.query["endMonth"] : startMonth;
        var endYear = parsedUrl.query["endYear"] ? parsedUrl.query["endYear"] : startYear;

        conn.query("CALL GetBookings(?, ?, ?, ?, ?, ?)", [startDay, startMonth, startYear, endDay, endMonth, endYear], (err, data) => {

            if (err) {
                res.statusCode = (err.code == "ER_SP_WRONG_NO_OF_ARGS" ? 400 : 500);
                if (res.statusCode == 400) {
                    res.end("{\"error\": \"Invalid combination of query parameters\"}");
                }
                else {
                    res.end("{\"error\": \"An error occured in the in the database query\"}");
                }
                console.log(JSON.stringify(err));
            }

            else {
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
    run(req, res, conn) {
        var parsedUrl = url.parse(req.url, true);

        var roomId = parsedUrl.query["roomId"];
        var fromDateTime = new Date(parsedUrl.query["fromDateTime"]);
        var toDateTime = new Date(parsedUrl.query["toDateTime"]);

        var currentDateTime = new Date();

        if (roomId == undefined || fromDateTime == "Invalid Date" || toDateTime == "Invalid Date") {
            res.statusCode = 400;
            res.end("{\"error\": \"Required parameters are missing\"}");
        }
        else if (currentDateTime > fromDateTime || currentDateTime > toDateTime) {
            res.statusCode = 400;
            res.end("{\"error\": \"Booking date must be after " + currentDateTime + "\"}");
        }
        else if (fromDateTime > toDateTime) {
            res.statusCode = 400;
            res.end("{\"error\": \"End time of booking must be after start time of booking\"}");
        }
        else {

            // TODO ADD check before adding BOOKING whether reserved room
            // - optionally in stored procedure

            conn.query("INSERT INTO room_bookings (RoomId, StartTime, EndTime) VALUES (?, ?, ?)", [roomId, fromDateTime, toDateTime], (err, result) => {

                if (err) {
                    res.statusCode = (err.code == "ER_SP_WRONG_NO_OF_ARGS" ? 400 : 500);
                    if (res.statusCode == 400) {
                        res.end("{\"error\": \"Invalid combination of query parameters\"}");
                    }
                    else {
                        res.end("{\"error\": \"An error occured in the in the database query\"}");
                    }
                    console.log(JSON.stringify(err));
                }

                res.end(JSON.stringify(result));

            });

        }

    }
};

var apiSubQueries = {
    ";GET": displayBookings,            /* "/bookings/" */
    "undefined;GET": displayBookings,   /* "/bookings" */
    "add;POST": addBooking              /* "/bookings/add" */
};