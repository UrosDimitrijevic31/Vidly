const { info } = require('winston');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors'); 

module.exports = function() {
    winston.add(winston.transports.File, { filename: 'logfile.log'});
    // !ovde cemo da logujemo pdoatke - to inace moze da bude nega druga baza NE RADI
    winston.add(winston.transports.MongoDB, { 
        db: 'mongodb://localhost/vidly', 
        level: info
    }); 

    //tako handle-amo greske koje nisu vezane za router, nego se desavaju iz nekog drugog razloga - uncaught exceptions, radi samo SINHRONO
    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    //bolja opcija nego iznad, nema potrebe obe da pisemo, ne radi ovako, naci kako radi
    winston.handleException (
        new winston.transports.Console({ colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log'})
    ),

    //tako handle-amo greske koje nisu vezane za router, nego se desavaju iz nekog drugog razloga - unhandled exceptions, radi samo ASINHRONO (PROMISI)
    process.on('unhandledRejection', (ex) => {
        // winston.error(ex.message, ex)
        // process.exit(1);
        throw ex; //hack da winston loguje ove greske, inace ih ne loguje samo uncaughtExceptions
    })

    // const logger = winston.createLogger({
    //     level: 'info',
    //     format: winston.format.json(),
    //     defaultMeta: { service: 'user-service' },
    //     transports: [
    //     new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //     new winston.transports.File({ filename: 'combined.log' }),
    //     ],
    // });

    // if (process.env.NODE_ENV !== 'production') {
    //     logger.add(new winston.transports.Console({
    //         format: winston.format.simple(),
    //     }));
    // }
}