const config = require('config');

module.exports = function () {
    if(!config.get('jwtPrivateKey')) { //potrebno zbog tokena
      throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
      //throw ''; ovako ne treba, ne ostaje zapisano nigde
    }
}