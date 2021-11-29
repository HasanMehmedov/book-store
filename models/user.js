const Joi = require('joi');
const mongoose = require('mongoose');
const NAME_REGEX = /^[A-Za-z][a-z]+( [A-Za-z][a-z]+)?$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const HASHED_PASSWORD_REGEX = /\$2[ayb]\$.{56}/;
const EMAIL_REGEX = /^\w[\w-\.]*\w@\w[\w-]*\.[\w]{2,4}$/;
const INVALID_NAME_MESSAGE = 'Invalid name.';
const INVALID_PASSWORD_MESSAGE = 'Invalid password.';
const INVALID_EMAIL_ADDRESS_MESSAGE = 'Invalid email address.';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        validate: {
            validator: function (v) { return v && v.match(NAME_REGEX); },
            message: INVALID_NAME_MESSAGE
        }
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        email: true,
        unique: true,
        validate: {
            validator: function (v) { return v && v.match(EMAIL_REGEX); },
            message: INVALID_EMAIL_ADDRESS_MESSAGE
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
        validate: {
            validator: function (v) { return v && v.match(HASHED_PASSWORD_REGEX); },
            message: INVALID_PASSWORD_MESSAGE
        }
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

async function validateUser(params) {

    const validationSchema = Joi.object({
        name: Joi.string().min(2).max(255).regex(new RegExp(NAME_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = INVALID_NAME_MESSAGE;
                    }
                });

                return errors;
            }),
        email: Joi.string().email().min(5).max(255).regex(new RegExp(EMAIL_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = INVALID_EMAIL_ADDRESS_MESSAGE;
                    }
                });

                return errors;
            }),
        password: Joi.string().min(8).max(255).regex(new RegExp(PASSWORD_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = INVALID_PASSWORD_MESSAGE;
                    }
                });

                return errors;
            }),
        isAdmin: Joi.boolean()
    });

    const { error } = validationSchema.validate(params);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }

    const emailTaken = await User.findOne({ email: params.email });
    if (emailTaken) {
        const emailTakenError = new Error('Email is already taken.');
        emailTakenError.status = 400;
        throw emailTakenError;
    }
}

module.exports.User = User;
module.exports.validate = validateUser;