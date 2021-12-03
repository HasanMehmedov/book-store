const express = require('express');
require('express-async-errors');
const app = express();
const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const config = require('config');
const home = require('./routes/home');
const books = require('./routes/books');
const customers = require('./routes/customers');
const purchases = require('./routes/purchases');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middlewares/error');

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/book-store' }));

app.use(express.json());
app.use('/', home);
app.use('/api/books', books);
app.use('/api/customers', customers);
app.use('/api/purchases', purchases);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

if (!config.get('jwtPrivateKey')) {
    console.error('jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/book-store', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB...'))
    .catch(err => console.log('Could not connect to the database.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));