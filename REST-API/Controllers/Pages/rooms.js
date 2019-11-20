exports.controller = (req, res, conn, callbackServer) => {
    conn.query("SELECT * FROM rooms", (err, data) => {

        // TODO handle err
        if (err) {
            res.statusCode = 500;
            console.log(JSON.stringify(err));
        }
        else {
            res.write(JSON.stringify(data));
        }
        
        callbackServer(req, res, true);
    });
}