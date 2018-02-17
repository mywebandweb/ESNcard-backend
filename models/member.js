'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemberSchema = Schema ({
  name: String,
  surname: String,
  email: String,
  birth: String,
  gender: String,
  numberesncard: String,
  comments: String,
  conditions: Boolean,
  image: String,
  // Se incorpora la propiedad de user con type: Schema.ObjectId
  // Con ref: 'User' se indica que hará referencia a User
  // Va guardar un id de otro documento
  user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Member', MemberSchema);
