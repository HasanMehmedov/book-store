const Joi = require('joi');
const mongoose = require('mongoose');
const NAME_REGEX = /^[A-Za-z][a-z]+$/;
const PHONE_NUMBER_REGEX = /^\d{6,8}$/;
const EMAIL_REGEX = /^\w[\w-\.]*\w@\w[\w-]*\.[\w]{2,4}$/;

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlenght: 100,
        validate: {
            validator: function (v) { return v && v.match(NAME_REGEX); },
            message: 'Invalid first name.'

        }
    },
    lastName: {
        type: String,
        required: true,
        minlenght: 2,
        maxlength: 100,
        validate: {
            validator: function (v) { return v && v.match(NAME_REGEX); },
            message: 'Invalid last name.'
        }
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        validate: {
            validator: function (v) { return v && v.match(EMAIL_REGEX); },
            message: 'Invalid email address.'
        }
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 8,
        validate: {
            validator: function (v) { return v && v.match(PHONE_NUMBER_REGEX); },
            message: 'Invalid phone number.'
        }
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(params) {
    const validateSchema = Joi.object({
        firstName: Joi.string().min(2).max(100).regex(new RegExp(NAME_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = 'Invalid first name.';
                    }
                });

                return errors;
            }),
        lastName: Joi.string().min(2).max(100).regex(new RegExp(NAME_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = 'Invalid last name.';
                    }
                });

                return errors;
            }),
        email: Joi.string().min(5).max(255).email(),
        phone: Joi.string().min(6).max(8).regex(new RegExp(PHONE_NUMBER_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.code === 'string.pattern.base') {
                        error.message = 'Invalid phone number.';
                    }
                });

                return errors;
            }),
        isGold: Joi.boolean()
    })

    const { error } = validateSchema.validate(params);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;