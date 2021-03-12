const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const {Rental, validate } = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const auth = require('../middleware/auth');

Fawn.init(mongoose);

//lista svih porudzbina
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

//kreiranje porudzbine
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer..');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie..');

    if(movie.numberInStock === 0 ) return res.status(400).send('Movi not in stock'); //stock - lager

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    
    try{
        new Fawn.Task()
            .save('rentails', rental)
            .update('movies', { _id: movie._id}, {
                $inc: { numberInStock: -1 } //$inc - to je operator od ranije
            })
            .run();
        
        res.send(rental); //kad pozove 2x save() moze doci do pucanja konekcije, pa nam trebaju transakcije (nesto slicno)
    }
    catch(ex) {
        res.status(500).send('Something failed.')
    }    
});

module.exports = router;