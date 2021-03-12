// const asyncMiddleware = require('../middleware/async'); 
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre'); //destruktuiranje objekta
const { Mongoose } = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId')

//liste svih zanrova
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//pojedinacni zanr
router.get('/:id', validateObjectId,  async (req, res) => {
    let genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('The Genre with the given Id not exist');

    res.send(genre);
})

// dodati zanr, treba omoguciti samo za ulogovane korisnike,  2. parametar je middleware, i njega ubacujemo opciono
router.post('/', auth, async (req, res) => {    
    let { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let genre = new Genre({
        name: req.body.name        
    })

    genre = await genre.save();
    res.send(genre);
})

//update zanra 
router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate({ _id: req.params.id}, {
        $set: {
            name: req.body.name
        }
    }, {new: true})

    if(!genre) return res.status(404).send('The genre with given id not found')
    res.send(genre);
})

//brisanje kursa
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
   const genre = await Genre.findByIdAndDelete({ _id: req.params.id }); 

   if(!genre) return res.status(404).send('Genre with given id not foubd');

   res.send(genre);
})

module.exports = router;