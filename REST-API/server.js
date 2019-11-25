// Main modules
var http = require("http");
var mysql = require("mysql");


// Custom modules
var dbConnection = require("./Controllers/Database/dbController");
var pageSelector = require("./Controllers/Pages/_pageController");


// Runs server and calls controller to handle page query
var main = async () => {
    var conn = await dbConnection.connect();
    http.createServer((req, res) => {
        res.setHeader("content-type", "text/json");
        pageSelector.handleQuery(req, res, conn);
    }).listen(8080);
}

main();