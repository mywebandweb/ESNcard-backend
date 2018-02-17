'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_esncard';

exports.createToken = function(user){
  var payload = {
      sub: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      // fecha creación
      iat: moment().unix(),
      // fecha expiración
      exp: moment().add(30, 'days').unix
  };

  return jwt.encode(payload, secret);

};
