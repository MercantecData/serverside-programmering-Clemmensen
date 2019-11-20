var url = require("url");

exports.controller = (req, res, conn, callbackServer) => {


    var parsedUrl = url.parse(req.url, true);


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

        callbackServer(req, res, true);
    });
}