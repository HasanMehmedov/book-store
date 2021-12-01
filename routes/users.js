const express = require('express');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/me', auth, async (req, res) => {

    const id = req.user._id;

    try {
        const user = await getUser(id);
        res.send(user);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {

    const params = req.body;

    try {
        await validate(params);

        const result = await createUser(params);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getUser(id) {

    const user = await User.findById(id).select({ name: 1, email: 1, isAdmin: 1 });
    if(!user) {
        const notFoundError = new Error(`User with id:${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return user;
}

async function createUser(params) {

    const hashedPassword = await generatePassword(params.password);

    const user = new User({
        name: params.name,
        email: params.email,
        password: hashedPassword
    });

    if (params.isAdmin) {
        user.isAdmin = params.isAdmin;
    }

    const result = await user.save();
    return {
        name: result.name,
        email: result.email,
        isAdmin: result.isAdmin
    };
}

async function generatePassword(password) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

module.exports = router;