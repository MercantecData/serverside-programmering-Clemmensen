var url = require("url");
var fs = require("fs");


var handleError = require("../Errors/errorController").handleError;
var runSubPage = require("./_subPageController").runSubPage;

var requestHelper = require("../../Helpers/requestHelper");
var keyHelper = require("../../Helpers/keyHelper");

// Select sub api controller endpoints
exports.controller = (req, res, conn) => runSubPage(req, res, conn, apiSubQueries);


// Display Api request page
var displayApiKeyRequest = {
    async run(req, res, conn) {
        res.setHeader("content-type", "text/html");
        res.end(fs.readFileSync("./Static/Pages/apiKeyRequest.html"));
    }
};


// Handle post request for api key
var addApiKey = {
    async run(req, res, conn) {
        var postData = await requestHelper.getPostBodyJSON(req, res);

        res.setHeader("content-type", "text/json");

        if (postData != undefined) {


            // Validate data is set
            if (postData["company"] == undefined || postData["contact_person"] == undefined || postData["contact_email"] == undefined
                || postData["company"] == "" || postData["contact_person"] == "" || postData["contact_email"] == "") {
                res.end("Sorry, some fields was missing data in the post request - please check that all fields are set");
            }

            var keyPhrase = keyHelper.getNewKey();
            var validFrom = getUtcSqlTimeStamp();
            var validTo = getUtcSqlTimeStamp(60 * 60 * 24 * 366);

            conn.query("INSERT INTO api_keys (keyphrase, company, contact_person, contact_email, valid_from, valid_to) VALUES (?, ?, ?, ?, ?, ?);",
                [keyPhrase, postData["company"], postData["contact_person"], postData["contact_email"], validFrom, validTo], (err, result) => {
                    if (!err)
                        res.end("Congratulations, your api-key is: " + keyPhrase);

                    else {
                        if (err.code == "ER_DUP_ENTRY")
                            res.end("Sorry, a key is already registrated to the e-mail address, please request a reopen of key instead");
                        else
                            res.end("Sorry, an error occured when attempting to create the key");

                        console.log(err);
                    }
                });
        }

        else handleError(req, res, 2, "The data sent with the api key formular was faulty");
    }
};


var getUtcSqlTimeStamp = (addSeconds = 0) => {
    var date = new Date(new Date().getTime() + addSeconds*1000);
    return date.getUTCFullYear() + "-" + date.getUTCMonth() + "-" + date.getUTCDate() + " "
        + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
}


var apiSubQueries = {
    ";GET": displayApiKeyRequest,            /* "/api-key/" */
    "undefined;GET": displayApiKeyRequest,   /* "/api-key" */
    "add;POST": addApiKey                    /* "/api-key/add" */
};