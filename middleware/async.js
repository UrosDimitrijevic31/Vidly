//ovo radimo da bi handlali greske koje mogu nastati u real woorl app
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }    
    }
}