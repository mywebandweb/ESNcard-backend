'use strict'

// Cargar Módulos
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var User = require('../models/user');
var Event = require('../models/event');

// Servicios


// Acciones
function pruebas(req,res) {
  res.status(200).send({
    message: 'Probando el controlador de eventos y la acción pruebas',
    user: req.user
  });
}

function saveEvent(req, res){
  var event = new Event();
  var params = req.body;

  if(params.name){
    event.name = params.name;
    event.initial_date = params.initial_date;
    event.expiration_date = params.expiration_date;
    event.price_esncard = params.price_esncard;
    event.price_no_esncard = params.price_no_esncard;
    event.places = params.places;
    event.item = params.item;
    event.user = req.user.sub;

    event.save((err, eventStored) => {
      if(err){
        res.status(500).send({message: 'Error en el servidor'});
      }else{
        if(!eventStored){
          res.status(404).send({message: 'No se ha guardado el evento'});
        }else{
          res.status(200).send({member: eventStored});
        }
      }
    });
  }else{
    res.status(200).send({message: 'El nombre del evento es obligatorio'});
  }
}

function getEvents(req, res){
  Event.find({}).populate({path: 'user'}).exec((err, events) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!events){
        res.status(404).send({message: 'No hay eventos'});
      }else{
        res.status(200).send({events});
      }
    }
  });
}

function getEvent(req, res){
  var eventId = req.params.id;

  Member.findById(eventId).populate({path: 'user'}).exec((err, event) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!member){
        res.status(404).send({message: 'El evento no existe'});
      }else{
        res.status(200).send({event});
      }
    }
  });
}

function updateEvent(req, res){
  var EventId = req.params.id;
  var update = req.body;

  Member.findByIdAndUpdate(EventId, update, {new: true}, (err, EventUpdated) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!EventUpdated){
        res.status(404).send({message: 'No se ha actualizado el evento'});
      }else{
        res.status(200).send({event: EventUpdated});
      }
    }
  });
}

module.exports = {
  pruebas,
  saveEvent,
  getEvents,
  getEvent,

};
