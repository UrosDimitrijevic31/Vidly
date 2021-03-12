const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre'); //destruktuiranjhe objekta, uzmemo samo sta nam treba

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 25
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: { 
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 5,
        max: 255
    }
}))

// *pomocna funkcija, sluzi za validaciju koda - Joi npm paket
function validateMovie(genre){
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(), // *korisnik treba da izabere zanr
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    }
    return Joi.validate(genre, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
