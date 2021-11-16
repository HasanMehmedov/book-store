const express = require('express');
const mongoose = require('mongoose');
const { Book, validate } = require('../models/book');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const books = await getBooks();
        res.send(books);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const book = await getBook(id);
        res.send(book);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {

    const params = req.body;

    try {
        validate(params);

        const result = await createBook(params);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', async (req, res) => {

    const id = req.params.id;
    const params = req.body;

    try {
        const result = await updateBook(id, params);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const result = await deleteBook(id);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getBooks() {

    const books = await Book.find();
    if (!books || books.length === 0) {
        const notFoundError = new Error('There are no books in the database.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return books;
}

async function getBook(id) {

    validateId(id);
    const book = await Book.findById(id);

    if (!book) {
        const notFoundError = new Error(`Book with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return book;
}

async function createBook(params) {

    const newBook = new Book({
        title: params.title,
        author: params.author,
        price: params.price,
        numberInStock: params.numberInStock
    });

    const result = await newBook.save();
    return result;
}

async function updateBook(id, params) {

    const book = await getBook(id);

    if (!params.title) {
        params.title = book.title;
    }
    if (!params.author) {
        params.author = book.author;
    }
    if (!params.price) {
        params.price = book.price;
    }
    if (!params.numberInStock) {
        params.numberInStock = book.numberInStock;
    }

    validate(params);

    book.set({
        title: params.title,
        author: params.author,
        price: params.price,
        numberInStock: params.numberInStock
    });

    const result = await book.save();
    return result;
}

async function deleteBook(id) {

    const book = await getBook(id);
    await Book.findByIdAndRemove(id);

    return book;
}

function validateId(id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const invalidIdError = new Error('Invalid book id.');
        invalidIdError.status = 400;
        throw invalidIdError;
    }
}

module.exports = router;