const Joi = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    author: {
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
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 300
    }
});

const Book = mongoose.model('Book', bookSchema);

function validateBook(params) {
    const validationSchema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        author: Joi.string().min(2).max(255).required(),
        price: Joi.number().min(0).max(200).required(),
        numberInStock: Joi.number().min(0).max(300).required()
    });

    const { error } = validationSchema.validate(params);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
}

module.exports.Book = Book;
module.exports.validate = validateBook;