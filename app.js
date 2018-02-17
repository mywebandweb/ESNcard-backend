// Use strict: Permite incorporar nuevas implementaciones de la nuevas versiones de js sin que de errores
'use strict'
//Carga el módulo Express y body-parser
var express = require('express');
//Body-parser nos va a permitir transformar todo lo del body a objeto json
var bodyParser = require('body-parser');

//Carga el Framework de Express
var app = express();

// Cargar Rutas
var user_routes = require('./routes/user');
var member_routes = require('./routes/member');
var event_routes = require('./routes/event');

// Middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
//Se convierte con lo que llegue del body de petición a json usable
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Acces-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Rutas base
app.use('/api', user_routes);
app.use('/api', member_routes);
app.use('/api', event_routes);

// Rutas body-parser


module.exports = app;
