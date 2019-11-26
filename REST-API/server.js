// Main modules
var http = require("http");
var mysql = require("mysql");


// Custom modules
var dbConnection = require("./Controllers/Database/dbController");
var pageSelector = require("./Controllers/Pages/_pageController");


// Runs server and calls controller to handle page query
var main = async () => {
    var conn = await dbConnection.connect();

    // End program if database connection fails
    if (conn == undefined) return;

    http.createServer((req, res) => {
        res.setHeader("content-type", "text/json");
        pageSelector.handleQuery(req, res, conn);
    }).listen(8080);
}

main();