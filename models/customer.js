const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customers', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}))

// *pomocna funkcija, sluzi za validaciju koda - Joi npm paket
function validateCourse(customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.number().min(5).max(50).required()
    }
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCourse;

