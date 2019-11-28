var handleError = require("../Controllers/Errors/errorController").handleError;

exports.isKeyValid = (req, res, conn) => {

    return conn.query("SELECT * FROM api_keys WHERE keyphrase = ? AND valid_from <= NOW() AND valid_to >= NOW() LIMIT 1",
        req.headers["api-key"], (err, data) => {

            var successAuthentification = false;

            if (err) {
                if (err.code == "ER_SP_WRONG_NO_OF_ARGS") handleError(req, res, 2);
                else handleError(req, res, 1);
            }

            else if (data.length == 0) handleError(req, res, 4);

            else successAuthentification = true;

            return successAuthentification;
        });
}

exports.getNewKey = () => {
    var hashKey = "";
    for (var i = 0; i < 32; i++) {
        hashKey += parseInt(Math.random() * 16).toString(16);
    }
    return hashKey;
}

