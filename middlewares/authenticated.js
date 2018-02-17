'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_esncard';

exports.ensureAuth = function(req, res, next){
  if(!req.headers.authorization){
    return res.status(403).send({
      message: 'La petición no tiene la cabecera de autenticación'
    });
  }

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    var payload = jwt.decode(token, secret);
    // comprueba si la fecha de expiración es menor que el momento actual
    if( payload.exp <= moment().unix() ){
      return res.status(401).send({
        message: 'El token ha expirado'
      });
    }
  }catch(ex){
    return res.status(404).send({
      message: 'El token no es válido'
    });
  }

  // variable para acceder al user desde cualquier componente
  req.user = payload;
  // permite passar al siguiente método de la ruta, sinó el middleware nunca passaria al siguiente método
  next();
};
