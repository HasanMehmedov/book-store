const winston = require('winston');

function error(err, req, res, next) {
    winston.error({ message: err.message, meta: err });

    res.status(err.status).send(err.message);
}

module.exports = error;