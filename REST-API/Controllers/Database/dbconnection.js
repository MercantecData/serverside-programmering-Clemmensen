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
            console.log("Error connecting to database");
            console.log(JSON.stringify(err));
        } else {
            callback(conn);
        }
    });
}