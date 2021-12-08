const express = require('express');
const home = require('../routes/home');
const books = require('../routes/books');
const customers = require('../routes/customers');
const purchases = require('../routes/purchases');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/', home);
    app.use('/api/books', books);
    app.use('/api/customers', customers);
    app.use('/api/purchases', purchases);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}