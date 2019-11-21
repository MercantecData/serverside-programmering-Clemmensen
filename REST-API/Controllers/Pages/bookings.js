var url = require("url");
var pageIdentifier = "/bookings";

// Select sub api controller endpoints
exports.controller = (req, res, conn) => {
    var subApiSelector = req.url.split("?")[0].split("/")[2] + ";" + req.method;

    if (!(subApiSelector in apiSubQueries)) {
        console.log("404, " + req.url);
        res.statusCode = 404;
        res.end();
    }
    else {
        res.setHeader("content-type", "text/json");
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
                console.log(JSON.stringify(err));
            }
            else {
                res.write(JSON.stringify(data));
            }

            res.end();
        });
    }
};

// Add a new booking to the system
var addBooking = {
    run(req, res, conn) {
        var parsedUrl = url.parse(req.url, true);

        var roomId = parsedUrl.query["roomId"];
        var fromDate = parsedUrl.query["fromDate"];
        var toDate = parsedUrl.query["toDate"];

        if (roomId == undefined || fromDate == undefined || toDate == undefined) {
            res.statusCode = 400;
        }

        res.end();
    }
};

var apiSubQueries = {
    ";GET": displayBookings,            /* "/bookings/" */
    "undefined;GET": displayBookings,   /* "/bookings" */
    "add;POST": addBooking              /* "/bookings/add" */
};