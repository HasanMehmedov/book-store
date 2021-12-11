const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

function logging() {
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtException.log' })
    );

    process.on('unhandledRejections', (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/book-store' }));
}

module.exports = logging;