var http = require("http");
var mysql = require("mysql");


var server = http.createServer(function (req, res) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "h3_serverside_programming"
    });

    con.connect(function (err) {

        // Challenge 1 - Error code handling
        if (err != null) {
            res.statusCode = 404;
            res.write(JSON.stringify(err));

            if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
                res.write("An error occured when connecting to the database");
            }
            res.end();
        }
        else {

            // Challenge 3 - Do specific function based on req url            
            var searchPos = req.url.indexOf("?");
            var baseReq = searchPos > 0 ? req.url.substring(0, searchPos) : req.url;

            console.log(baseReq);

            switch (baseReq) {

                case "/add":
                    con.query("INSERT INTO names (name) VALUES ('foo')", function (err, data) {
                        if (err != null) {
                            res.statusCode = 404;

                            if (err.code == "ER_NO_SUCH_TABLE") {
                                res.write("The expected table was not found");
                            }

                        }
                        else {
                            // Challenge 2 - Check data content when insertion is made
                            res.write(JSON.stringify(data));
                        }
                        res.end();
                    });
                    break;

                case "/view":
                    con.query("SELECT * FROM names", function (err, data) {

                        if (err != null && err.code == "ER_NO_SUCH_TABLE") {
                            res.statusCode = 404;
                            res.write("The expected table was not found");
                            res.end();
                        }
                        else {
                            res.write(JSON.stringify(data));
                            res.end();
                        }
                    });
                    break;

                case "/delete":

                    var userIdPosStart = req.url.indexOf("Id");

                    if (userIdPosStart == -1) {
                        res.write("Please provide Id of user to delete (Use Id=123)");
                        res.end();
                    }
                    
                    else {
                        var userId = req.url.substr(userIdPosStart + 3).split('&')[0];

                        // Do not allow call with no id, "letters" or "1a"
                        if (userId == "" || !parseInt(userId) || parseInt(userId).toString() != userId) {
                            res.write("User id \"" +userId + "\" not found. (Use Id=123)");
                            res.end();
                            return;
                        }
                        
                        con.query("DELETE FROM names where id=?", userId, function (err, data) {

                            
                            if (err != null && err.code == "ER_NO_SUCH_TABLE") {
                                res.statusCode = 404;
                                res.write("The expected table was not found");
                            }
                            
                            else {

                                res.write(JSON.stringify(data));
                            }
                            res.end();
                        });

                    }
                    break;

                default:
                    res.statusCode = 404;
                    res.end("No page was found");
            }
        }
    });
});

server.listen(8080);