// Main modules
var http = require("http");
var mysql = require("mysql");

// Custom modules
var dbconnection = require("./Controllers/Database/dbConnection");

var serverInit = (conn) => {
    http.createServer((req, res) => {


        if (req.url == "/rooms") {
            conn.query("SELECT * FROM rooms", (err, data) => {

                // TODO handle err
                if (err) {
                    res.statusCode = 500;
                    console.log(JSON.stringify(err));
                }
                else {
                    res.write(JSON.stringify(data));
                }
                res.end();
            });
        }

        else {
            res.statusCode = 404;
            res.end();
        }

    }).listen(8080);
}

// Initialize db connection and call server start
dbconnection.connect(serverInit);