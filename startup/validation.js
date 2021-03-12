const Joi = require('joi');

module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi); //da ne bi pisali u svakom modelu
}