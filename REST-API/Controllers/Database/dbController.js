var mysql = require("mysql");

var dbConnectionString = {
    host: "localhost",
    user: "root",
    password: "",
    database: "h3_macl_rest_api",
    timezone: "utc"
};

exports.connect = async () => {
    return await new Promise((resolve, reject) => {
        var conn = mysql.createConnection(dbConnectionString);

        conn.connect((err) => {
            if (!err) resolve(conn);
            else reject(err);
        });
    }).catch(error => {
        console.error("An error occured while connecting to database: " + JSON.stringify(error));
    })
}