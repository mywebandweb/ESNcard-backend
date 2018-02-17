'user strict'

// Cargar Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define el esquema de las propiedades de Usuario
var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String
});

// Exporta Usuario
module.exports = mongoose.model('User', UserSchema);
