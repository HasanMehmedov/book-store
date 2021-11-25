const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const NAME_REGEX = /^[A-Za-z][a-z]+$/;
const PHONE_NUMBER_REGEX = /^\d{6,8}$/;
const INVALID_FIRST_NAME_MESSAGE = 'Invalid first name.';
const INVALID_LAST_NAME_MESSAGE = 'Invalid last name.';
const INVALID_PHONE_NUMBER_MESSAGE = 'Invalid phone number.';
const AUTHOR_NAME_REGEX = /^[A-Za-z][a-z]+( [A-Za-z][a-z]+)?$/;
const INVALID_AUTHOR_NAME_MESSAGE = 'Invalid author name.';

const purchaseSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            firstName: {
                type: String,
                required: true,
                minlength: 2,
                maxlenght: 100,
                validate: {
                    validator: function (v) { return v && v.match(NAME_REGEX); },
                    message: INVALID_FIRST_NAME_MESSAGE

                }
            },
            lastName: {
                type: String,
                required: true,
                minlenght: 2,
                maxlength: 100,
                validate: {
                    validator: function (v) { return v && v.match(NAME_REGEX); },
                    message: INVALID_LAST_NAME_MESSAGE
                }
            },
            phone: {
                type: String,
                required: true,
                minlength: 6,
                maxlength: 8,
                validate: {
                    validator: function (v) { return v && v.match(PHONE_NUMBER_REGEX); },
                    message: INVALID_PHONE_NUMBER_MESSAGE
                }
            }
        }),
        required: true
    },
    book: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 255
            },
            price: {
                type: Number,
                required: true,
                min: 0,
                max: 200
            }
        }),
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

function validatePurchase(params) {
    const validationSchema = Joi.object({
        customerId: Joi.objectId().required(),
        bookId: Joi.objectId().required()
    });

    const { error } = validationSchema.validate(params);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Purchase = Purchase;
module.exports.validate = validatePurchase;