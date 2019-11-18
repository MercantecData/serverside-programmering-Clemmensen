var http = require("http");
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "h3_serverside_programming"
});



var server = http.createServer(function(req, res) {
    con.connect(function(err) {

        // Challenge 1, error code handling
        if (err != null) {
            res.statusCode = 404;

            if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
                res.write("An error occured when connecting to the database");
            }

            res.end();
        }

        else {

            // Challenge 2, insert statement's data object contents
            var insertResult = con.query("INSERT INTO names (name) VALUES ('foo')", function(err, data) {
                if (err != null) {
                    res.statusCode = 404;

                    if (err.code == "ER_NO_SUCH_TABLE") {
                        res.write("The expected table was not found");
                    }

                    res.end();
                }
                res.write(JSON.stringify(data));
                res.end();

            });

            /*
            con.query("SELECT * FROM names", function(err, data) {

                if (err != null && err.code == "ER_NO_SUCH_TABLE") {
                    res.statusCode = 404;
                    res.write("The expected table was not found");
                    res.end();
                }
                else {
                    res.write(JSON.stringify(data));
                    res.end();
                }
                
            });*/
        }

    });
});

server.listen(8080);