const Joi = require('joi');
const mongoose = require('mongoose');
const PHONE_NUMBER_REGEX = /^\d{6,10}$/;
const EMAIL_REGEX = /^\w[\w-\.]*\w@\w[\w-]*\.[\w]{2,4}$/;

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlenght: 255
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        validate: {
            validator: function (v) {
                return v && v.match(EMAIL_REGEX);
            },
            message: 'Invalid email address.'
        }
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 10,
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
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(255).email(),
        phone: Joi.string().min(6).max(10).regex(new RegExp(PHONE_NUMBER_REGEX)).required()
            .error(errors => {
                errors.forEach(error => {
                    if (error.type === 'string.regex.base') {
                        error.message = 'Invalid phone number.';
                    }
                });

                return errors;
            })
    })

    const { error } = Joi.validate(params, validateSchema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;