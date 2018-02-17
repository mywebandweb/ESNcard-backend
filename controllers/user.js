'use strict'
// Cargar Módulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var User = require('../models/user');

// Servicios
var jwt = require('../services/jwt');

// Acciones
function pruebas(req,res) {
  res.status(200).send({
    message: 'Probando el controlador de usuarios y la acción pruebas',
    user: req.user
  });
}

function saveUser(req, res) {

  // Crear objeto del usuario
  var user = new User();

  // Recoger parámetros petición
  var params = req.body;

  // Método para Registrar Usuarios
  if(params.password && params.name && params.surname && params.email){

    // Asignar valores al objeto Usuario
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    // User.findOne({email: user.email.toLowerCase()} comprueba si existe un Usuario con el email introducido
    User.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
      if(err){
        res.status(500).send({message: 'Error al comprovar el usuario'});
      }else {
        // Si usuario no existe
        if(!issetUser){
          // Cifrar contraseña
          bcrypt.hash(params.password, null, null, function(err, hash){

            user.password = hash;

            // Guardar usuario en base de datos
            user.save( (err, userStored) => {
              // Si contiene un error - console log
              if(err){
                res.status(500).send({message: 'Error al Guardar el usuario'});
              // Sinó comprovar si el usuario no se ha registrado - console log
              }else{
                if(!userStored){
                  res.status(404).send({message: 'No se ha registrado el usuario'});
                // Si el usuario se ha registrado entonces guardamos el usuario en la base de datos
                }else {
                  res.status(200).send({user: userStored});
                }
              }
            });
          });
        // Si usuario existe
        }else {
          res.status(404).send({message: 'El usuario no puede registrarse'});
        }
      }
    });

  }else{
    res.status(200).send({
      message: 'Introduce los datos correctamente para pode registrar el usuario'
    });
  }
}

// Método para Logear Usuarios
function login(req, res){

  var params = req.body;

  var email = params.email;
  var password = params.password;

  // User.findOne({email: user.email.toLowerCase()} comprueba si existe un Usuario con el email introducido
  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if(err){
      res.status(500).send({message: 'Error al comprobar el usuario'});
    }else {

      // Si usuario existe
      if(user){

          // Compara que la contraseña sea la misma registrada en la base de datos
          bcrypt.compare(password, user.password, (err, check) => {
            // si la password coincide
            if(check){
              // comprobar y generar el token
              if(params.gettoken){
                // devolver el token jwt
                res.status(200).send({
                  token: jwt.createToken(user)
                });
              }else{
                res.status(200).send({user});
              }

            // si la password no coincide
            }else {
              res.status(404).send({message: 'El usuario no ha podido loguearse correctamente'});
            }
          });

      // Si usuario no existe
      }else{
          res.status(404).send({message: 'El usuario no ha podido loguearse'});
      }

    }
  });
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;
  delete update.password;
  
  // comprueba si el Id del usuario es el Id del usuario que se esta buscando
  if(userId != req.user.sub){
    return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
  }

  User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) =>{
    if(err){
      res.status(500).send({
        message: 'Error al actualizar usuario'
      });
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
      }else{
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){

      if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
      }

      User.findByIdAndUpdate(userId, {image:file_name}, {new:true}, (err, userUpdated) =>{
        if(err){
          res.status(500).send({
            message: 'Error al actualizar usuario'
          });
        }else{
          if(!userUpdated){
            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
          }else{
            res.status(200).send({user: userUpdated, image: file_name});
          }
        }
      });

    }else{
      fs.unlink(file_path, (err) => {
        if(err){
          res.status(200).send({message: 'Extensión no válida y fichero no borrado'});
        }else{
          res.status(200).send({message: 'Extensión no válida'});
        }
      });
    }

  }else{
    res.status(200).send({message: 'No se han subido archivos'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/'+imageFile;
  // Comprueba si el archivo existe
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'La imagen no existe'});
    }
  })
}

function getTrader(req, res){
  User.find({role:'ROLE_ADMIN'}).exec((err,users) =>{
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!users){
        res.status(404).send({message: 'No hay cuidadores'});
      }else{
        res.status(200).send({users});
      }
    }
  })
}

// Exportamos los módulos
module.exports = {
  pruebas,
  saveUser,
  login,
  updateUser,
  uploadImage,
  getImageFile,
  getTrader
};
