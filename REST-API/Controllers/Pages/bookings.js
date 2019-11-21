var url = require("url");


/* Call examples:
 * http://localhost:8080/bookings?day=20
 * http://localhost:8080/bookings?month=10
 * http://localhost:8080/bookings?year=2018 // fix this
 * http://localhost:8080/bookings?day=20&year=2018&month=11&endDay=21&endMonth=11&endYear=2019
 */
exports.controller = (req, res, conn, callbackServer) => {
    var parsedUrl = url.parse(req.url, true);

    console.log(req.method);
    console.log(JSON.stringify(parsedUrl));

    var startDay = parsedUrl.query["day"] ? parsedUrl.query["day"] : 0;
    var startMonth = parsedUrl.query["month"] ? parsedUrl.query["month"] : 0;
    var startYear = parsedUrl.query["year"] ? parsedUrl.query["year"] : 0;

    var endDay = parsedUrl.query["endDay"] ? parsedUrl.query["endDay"] : startDay;
    var endMonth = parsedUrl.query["endMonth"] ? parsedUrl.query["endMonth"] : startMonth;
    var endYear = parsedUrl.query["endYear"] ? parsedUrl.query["endYear"] : startYear;

    console.log("Calling with " + startDay + "," + startMonth + "," + startYear + "," + endDay + "," + endMonth + "," + endYear);

    conn.query("CALL GetBookings(?, ?, ?, ?, ?, ?)", [startDay, startMonth, startYear, endDay, endMonth, endYear], (err, data) => {
        if (err) {
            res.statusCode = (err.code == "ER_SP_WRONG_NO_OF_ARGS" ? 400 : 500);
            console.log(JSON.stringify(err));
        }
        else {
            res.write(JSON.stringify(data));
        }

        callbackServer(req, res, true);
    });
}