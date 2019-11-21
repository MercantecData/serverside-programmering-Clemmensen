exports.controller = (req, res, conn, callbackServer) => {
    conn.query("SELECT * FROM rooms", (err, data) => {

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