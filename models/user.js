const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
    //kad nam treba vise ro;a, i vise nekih operacija - sira slika ista kao sa isAdmin, proverimo ap u skladu sa tim delujemo
    // roles: [],
    // operations: []
});

// .methods.ime metode = dodajemo metode u objekat :)
userSchema.methods.generateAuthToken  = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey')); //na osnovu ova dva parametra se formira digitalni potpis, nikad se ne pise ovako kljuc (2. argument)
    return token;
}

const User = mongoose.model('User', userSchema);

//pomocna funkcija, sluzi za validaciju koda - Joi npm paket
function validateUser(user){
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(1024).required()
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
