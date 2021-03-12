const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Acces denied. No token provide.')

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //config - uzimamo kljuc iz environment varijabli, i proveravamo ga
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.')    
    }
}

