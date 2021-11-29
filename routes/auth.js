const express = require('express');
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();

const INVALID_EMAIL_OR_PASSWORD_MESSAGE = 'Invalid email or password.';

router.post('/', async (req, res) => {

    const params = req.body;

    try {
        validateAuth(params);

        const email = params.email;
        const user = await validateEmail(email);

        const password = params.password;
        const hashedPassword = user.password;
        await validatePassword(password, hashedPassword);

        const token = user.generateAuthToken();

        res.header('x-auth-token', token).send({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

function validateAuth(auth) {

    const validationSchema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).required()
    });

    const { error } = validationSchema.validate(auth);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

async function validateEmail(email) {

    const user = await User.findOne({ email: email });
    if (!user) {
        const invalidEmailOrPasswordError = new Error(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
        invalidEmailOrPasswordError.status = 400;
        throw invalidEmailOrPasswordError;
    }

    return user;
}

async function validatePassword(password, hashedPassword) {

    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (!validPassword) {
        const invalidEmailOrPasswordError = new Error(INVALID_EMAIL_OR_PASSWORD_MESSAGE);
        invalidEmailOrPasswordError.status = 400;
        throw invalidEmailOrPasswordError;
    }
}

module.exports = router;