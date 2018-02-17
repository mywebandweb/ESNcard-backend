'user strict'

var express = require('express');
var EventController = require('../controllers/event');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');

api.get('/pruebas-events', md_auth.ensureAuth, EventController.pruebas);
api.post('/event', [md_auth.ensureAuth, md_admin.isAdmin], EventController.saveEvent);
api.get('/events', EventController.getEvents);
api.get('/event/:id', EventController.getEvent);
api.put('/event/:id', [md_auth.ensureAuth, md_admin.isAdmin], EventController.updateEvent);

module.exports = api;
