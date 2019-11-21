// Main modules
var http = require("http");
var mysql = require("mysql");


// Custom modules
var dbConnection = require("./Controllers/Database/dbConnection");
var pageSelector = require("./Controllers/Pages/pageController");


// Runs server and calls controller to handle page query
var serverInit = (conn) => {
    http.createServer((req, res) => {
        pageSelector.handleQuery(req, res, conn);
    }).listen(8080);
}


// Initialize db connection and call server start
dbConnection.connect(serverInit);