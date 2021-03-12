const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');
const auth = require('../middleware/auth');

//lista svih customera
router.get('/', async (req, res) => {
    const customers = await Customers.find().sort('name');
    res.send(customers);
})

//lista customera sa odredjenim id-jem
router.get('/:id', async (req, res) => {
    const customer = await Customers.findById({_id: req.params.id })
    if(!customer) return res.status(404).send('Customer not exist')
    res.send(customer);
})

//kreiranje customera
router.post('/', auth, async (req, res) => {
    let {error} = validate(req.body);
    if(error) return res,status(404).send(error.details[0].message);
    
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }) 

    await customer.save();
    res.send(customer)
})

//update korisnika
router.put('/:id', auth, async (req, res) => {
    let {error} = validate(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate({_id: req.params.id}, {
        $set: {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }
    }, { new: true })
    if(!customer) return res.status(404).send('The genre with given id not found')

    res.send(customer)
})

//brisanje korisnika
router.delete('/:id', auth, async (req, res) => {
    const customer = await Customers.findByIdAndDelete({ _id: req.params.id });

    if(!customer) return res.status(404).send('Customer with given id not foubd');

    res.send(customer);
})

module.exports = router;