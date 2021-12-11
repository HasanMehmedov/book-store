const winston = require('winston');
const mongoose = require('mongoose');

function db() {
    mongoose.connect('mongodb://localhost/book-store', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => winston.info('Successfully connected to MongoDB...'));
}

module.exports = db;