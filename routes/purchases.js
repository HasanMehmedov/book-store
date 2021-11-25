const express = require('express');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const { Purchase, validate } = require('../models/purchase');
const { Customer } = require('../models/customer');
const { Book } = require('../models/book');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {

    try {
        const purchases = await getPurchases();
        res.send(purchases);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {

    const params = req.body;

    try {
        const customerId = params.customerId;
        const customer = await getCustomer(customerId);

        const bookId = params.bookId;
        const book = await getBook(bookId);

        validate(params);

        const result = await createPurchase(book, customer);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getPurchases() {

    const purchases = await Purchase.find();
    if (!purchases || purchases.length === 0) {
        const notFoundError = new Error('There are no saved purchases in the database.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return purchases;
}

async function createPurchase(book, customer) {

    if (book.numberInStock === 0) {
        const outOfStockError = new Error('Book is out of stock.');
        outOfStockError.status = 404;
        throw outOfStockError;
    }

    const purchase = new Purchase({
        customer: {
            _id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone
        },
        book: {
            _id: book._id,
            title: book.title,
            price: book.price
        }
    });

    if (customer.isGold) {
        purchase.book.price = book.price * 0.8;
    }

    new Fawn.Task()
        .save('purchases', purchase)
        .update('books', { _id: book._id }, {
            $inc: { numberInStock: -1 }
        })
        .run();

    return purchase;
}

async function getCustomer(id) {

    try {
        validateId(id);
    }
    catch (err) {
        err.message = 'Invalid customer id.';
        throw err;
    }

    const customer = await Customer.findById(id);
    if (!customer) {
        const notFoundError = new Error(`Customer with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

async function getBook(id) {

    try {
        validateId(id);
    }
    catch (err) {
        err.message = 'Invalid book id.';
        throw err;
    }

    const book = await Book.findById(id);
    if (!book) {
        const notFoundError = new Error(`Book with id: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return book;
}

function validateId(id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const invalidIdError = new Error('Invalid id.');
        invalidIdError.status = 400;
        throw invalidIdError;
    }
}

module.exports = router;