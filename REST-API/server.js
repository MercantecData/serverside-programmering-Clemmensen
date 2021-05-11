// Main modules
var http = require("http");
var mysql = require("mysql");


// Custom modules
var dbConnection = require("./Controllers/Database/dbController");
var pageController = require("./Controllers/Pages/_pageController");
var keyHelper = require("./Helpers/keyHelper");


// Runs server and calls controller to handle page query
var main = async () => {
    var conn = await dbConnection.connect();

    // End program if database connection fails
    if (conn == undefined) return;

    http.createServer((req, res) => {
        res.setHeader("content-type", "text/json");

        // Allow people to access api-key page for requesting a key
        var baseRequest = "/" + req.url.split("?")[0].split("/")[1];
        if (baseRequest == "/" || baseRequest == "/api-key")
            pageController.handleQuery(req, res, conn);

        // Lock the API to require an api-key authentification/validation
        else if (keyHelper.isKeyValid(req, res, conn)) pageController.handleQuery(req, res, conn);

    }).listen(8080);
}

main();