const express = require('express');
require('express-async-errors');
const app = express();
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const config = require('config');

require('./startup/routes')(app);

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/book-store' }));

if (!config.get('jwtPrivateKey')) {
    console.error('jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/book-store', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB...'))
    .catch(err => console.log('Could not connect to the database.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));