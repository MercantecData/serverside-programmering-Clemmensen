var mysql = require("mysql");

var dbConnectionString = {
    host: "localhost",
    user: "root",
    password: "",
    database: "h3_macl_rest_api"
};

exports.connect = (callback) => {
    var conn = mysql.createConnection(dbConnectionString);
    conn.connect((err) => {
        if (err) {
            console.error("An error occured while connecting to database:");
            console.error(JSON.stringify(err));
        } else {
            callback(conn);
        }
    });
}