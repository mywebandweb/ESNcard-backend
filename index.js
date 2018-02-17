// Use strict: Permite incorporar nuevas implementaciones de la nuevas versiones de js sin que de errores
'use strict'

var mongoose = require ('mongoose');
// Importar app.js
var app = require('./app');
var port = process.env.PORT || 3789;

/*Hacemos la conexión a la base de datos - Método 1
mongoose.connect('mongodb://localhost:27017/esncard_db', (err, res) => {
  if(err){
    throw err;
  }else {
    console.log('La conexión a la base de datos esncard_db se ha realizado con éxito');
  }
});*/

//Hacemos la conexión a la base de datos - Método 2 - Con promesas implementando useMongoClient
//A efectos prácticos los dos métodos son válidos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/esncard_db', { useMongoClient: true } )
    .then( () => {
      console.log('La conexión a la base de datos esncard_db se ha realizado con éxito');
      //Método el cual escucha a las peticiones del servidor
      app.listen(port, () => {
        console.log('El servidor local con node y express está corriendo correctamente');
      });
    })
    .catch( err => console.log(err));
