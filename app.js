const express = require('express');
const app = express();
const mongoose = require('mongoose');
const home = require('./routes/home');
const books = require('./routes/books');

app.use(express.json());
app.use('/', home);
app.use('/api/books', books);

mongoose.connect('mongodb://localhost/book-store', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to MongoDB...'))
    .catch(err => console.log('Could not connect to the database.'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));