var url = require("url");

exports.controller = async (req, res, conn, callbackServer) => {


    var parsedUrl = url.parse(req.url, true);

    var startDay = parsedUrl.query["day"] ? parsedUrl.query["day"] : 0;
    var startMonth = parsedUrl.query["month"] ? parsedUrl.query["month"] : 0;
    var startYear = parsedUrl.query["year"] ? parsedUrl.query["year"] : 0;

    var endDay = parsedUrl.query["endDay"] ? parsedUrl.query["endDay"] : startDay;
    var endMonth = parsedUrl.query["endMonth"] ? parsedUrl.query["endMonth"] : startMonth;
    var endYear = parsedUrl.query["endYear"] ? parsedUrl.query["endYear"] : startYear;

    await conn.query("CALL GetBookings(?, ?)", [startDay, endDay], (err, data) => {
        if (err) {
            res.statusCode = 500;
            console.log(JSON.stringify(err));
        }
        else {
            res.write(JSON.stringify(data));
        }

        callbackServer(req, res, true);
    });
}