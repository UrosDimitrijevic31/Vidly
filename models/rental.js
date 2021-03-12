const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment'); //because TTD

const rentalSchema = new mongoose.Schema({
    customer: { 
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }      
      }),  
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true, 
          minlength: 5,
          maxlength: 255
        },
        dailyRentalRate: { 
          type: Number, 
          required: true,
          min: 0,
          max: 255
        }   
      }),
      required: true
    },
    dateOut: { 
      type: Date, 
      required: true,
      default: Date.now
    },
    dateReturned: { 
      type: Date
    },
    rentalFee: { 
      type: Number, 
      min: 0
    }
  });

  //  !STATIC METHOD
  rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
      'customer._id': customerId,
      'movie._id': movieId,
    });
  }
  
  rentalSchema.methods.return = function() {
    this.dateReturned = new Date();
  
    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
  }

  const Rental = mongoose.model('Rental', rentalSchema);


// pomocna funkcija, sluzi za validaciju koda - Joi npm paket
function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),// *objectId nam treba da proveri da li je dobar id, da lije string i sadrzi 24 karaktera
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental