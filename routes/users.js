const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const{ User, validate } = require('../models/user');

//hocemo da dobijemo svoje podatke, potreban je token, zato koristimo auth
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

//registrovanje usera
router.post('/', async (req, res) => {    
    let { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if(user) res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); //izabere koje vrednosti iz objekta hocemo da uzmemo
})

module.exports = router;