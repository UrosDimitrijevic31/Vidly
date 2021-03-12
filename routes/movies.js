const mongoose = require('mongoose');
const expresss = require('express');
const router = expresss.Router();
const { Movie, validate } = require('../models/movie');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');

// *Lista svih filmova
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
})

// *pojedinacni filmovi
router.get('/:id', async (req, res) => {
    let movie = await Movie.findById(req.params.id);

    if(!movie) return res.status(404).send('Movie not exist');

    res.send();
})

// *dodati film
router.post('/', auth, async (req, res) => {
    let { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre..');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate, 
    })

    await movie.save();
    res.send(movie);
})

// *update film
router.put('/:id', auth,  async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, {new: true})

    if(!movie) return res.status(404).send('The movie with given id not found')
    res.send(movie);
})

router.delete('/:id', auth, async(req, res) => {
    const movie = await Movie.findByIdAndDelete({_id: req.body.id})

    if(!movie) return res.status(404).send('The movie with given id not found')
    res.send(movie);
})

module.exports = router;