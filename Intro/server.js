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

        if (err != null && err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
            res.write("An error occured when connecting to the database");
            res.end();
        }

        else {
            con.query("SELECT * FROM names", function(err, data) {

                if (err != null && err.code == "ER_NO_SUCH_TABLE") {
                    res.write("The expected table was not found");
                    res.end();
                }
                else {
                    res.write(JSON.stringify(data));
                    res.end();
                }
                
            });
        }

    });
});

server.listen(8080);