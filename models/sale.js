'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MemberSchema = Schema ({
  name: String,
  initial_date: String,
  expiration_date: String,
  price_esncard: Number,
  price_no_esncard: Number,
  places: Number,
  item: Number,
  // Se incorpora la propiedad de user con type: Schema.ObjectId
  // Con ref: 'User' se indica que hará referencia a User
  // Va guardar un id de otro documento
  user: { type: Schema.ObjectId, ref: 'User' }
  event: { type: Schema.ObjectId, ref: 'Event' }
});

module.exports = mongoose.model('Event', MemberSchema);
