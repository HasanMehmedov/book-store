const { Customer, validate } = require('../models/customer');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

router.get('/', async (req, res) => {

    const customers = await getCustomers();
    res.send(customers);
});

router.get('/:id', async (req, res) => {

    const id = req.params.id;

    const customer = await getCustomer(id);
    res.send(customer);
});

router.post('/', auth, async (req, res) => {

    const params = req.body;

    validate(params);

    const result = await createCustomer(params);
    res.send(result);
});

router.put('/:id', auth, async (req, res) => {

    const id = req.params.id;
    const params = req.body;

    const result = await updateCustomer(id, params);
    res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {

    const id = req.params.id;

    const result = await deleteCustomer(id);
    res.send(result);
});

async function getCustomers() {

    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
        const notFoundError = new Error('There are no customers in the database.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customers;
}

async function getCustomer(id) {

    validateId(id);

    const customer = await Customer.findById(id);

    if (!customer) {
        const notFoundError = new Error(`Customer with ID: ${id} was not found!`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

async function createCustomer(params) {

    const newCustomer = new Customer({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        isGold: params.isGold
    });

    const result = await newCustomer.save();
    return result;
}

async function updateCustomer(id, params) {

    const customer = await getCustomer(id);

    if (!params.firstName) {
        params.firstName = customer.firstName;
    }
    if (!params.lastName) {
        params.lastName = customer.lastName;
    }
    if (!params.email) {
        params.email = customer.email;
    }
    if (!params.phone) {
        params.phone = customer.phone;
    }
    if (!params.isGold) {
        params.isGold = customer.isGold;
    }

    validate(params);

    customer.set({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
        isGold: params.isGold
    });

    const result = await customer.save();
    return result;
}

async function deleteCustomer(id) {

    const customer = await getCustomer(id);
    await Customer.findByIdAndRemove(id);

    return customer;
}

function validateId(id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const invalidIdError = new Error('Invalid customer id.');
        invalidIdError.status = 400;
        throw invalidIdError;
    }
}

module.exports = router;