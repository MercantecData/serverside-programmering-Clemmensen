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


var displayRooms = {
    run(req, res, conn, callbackServer) {
        conn.query("SELECT * FROM rooms", (err, data) => {

            if (err) {
                res.statusCode = 500;
                console.log(JSON.stringify(err));
                res.end("{\"error\": \"An error occured in the database query\"}");
            }
            else {
                res.end(JSON.stringify(data));
            }
        });
    }
}



var apiSubQueries = {
    ";GET": displayRooms,            /* "/rooms/" */
    "undefined;GET": displayRooms,   /* "/rooms" */
};