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
        con.query("SELECT * FROM names", function(err, data) {
            res.write(JSON.stringify(data));
            res.end();
        });
    });
});

server.listen(8080);