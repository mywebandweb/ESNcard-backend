'use strict'

// Cargar Módulos
var fs = require('fs');
var path = require('path');

// Cargar Modelos
var User = require('../models/user');
var Member = require('../models/member');

// Servicios


// Acciones
function pruebas(req,res) {
  res.status(200).send({
    message: 'Probando el controlador de socios y la acción pruebas',
    user: req.user
  });
}

function saveMember(req, res){
  var member = new Member();
  var params = req.body;

  if(params.name){
    member.name = params.name;
    member.surname = params.surname;
    member.email = params.email;
    member.birth = params.birth;
    member.gender = params.gender;
    member.numberesncard = params.numberesncard;
    member.comments = params.comments;
    member.conditions = params.conditions;
    member.image = null;
    member.user = req.user.sub;

    member.save((err, memberStored) => {
      if(err){
        res.status(500).send({message: 'Error en el servidor'});
      }else{
        if(!memberStored){
          res.status(404).send({message: 'No se ha guardado el socio'});
        }else{
          res.status(200).send({member: memberStored});
        }
      }
    });
  }else{
    res.status(200).send({message: 'El nombre del socio es obligatorio'});
  }
}

function getMembers(req, res){
  Member.find({}).populate({path: 'user'}).exec((err, members) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!members){
        res.status(404).send({message: 'No hay socios'});
      }else{
        res.status(200).send({members});
      }
    }
  });
}

function getMember(req, res){
  var memberId = req.params.id;

  Member.findById(memberId).populate({path: 'user'}).exec((err, member) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!member){
        res.status(404).send({message: 'El socio no existe'});
      }else{
        res.status(200).send({member});
      }
    }
  });
}

function updateMember(req, res){
  var memberId = req.params.id;
  var update = req.body;

  Member.findByIdAndUpdate(memberId, update, {new: true}, (err, memberUpdated) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!memberUpdated){
        res.status(404).send({message: 'No se ha actualizado el socio'});
      }else{
        res.status(200).send({member: memberUpdated});
      }
    }
  });
}

function uploadImage(req, res){
  var memberId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){

      Member.findByIdAndUpdate(memberId, {image:file_name}, {new:true}, (err, memberUpdated) =>{
        if(err){
          res.status(500).send({
            message: 'Error al actualizar socio'
          });
        }else{
          if(!memberUpdated){
            res.status(404).send({message: 'No se ha podido actualizar el socio'});
          }else{
            res.status(200).send({user: memberUpdated, image: file_name});
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
  var path_file = './uploads/members/'+imageFile;
  // Comprueba si el archivo existe
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'La imagen no existe'});
    }
  })
}

function deleteMember(req, res){
  var memberId = req.params.id;

  Member.findByIdAndRemove(memberId, (err, memberRemoved) => {
    if(err){
      res.status(500).send({
        message: 'Error en la petición'
      });
    }else{
      if(!memberRemoved){
        res.status(404).send({message: 'No se ha podido borrar el socio'});
      }else{
        res.status(200).send({member: memberRemoved});
      }
    }
  });
}

module.exports = {
  pruebas,
  saveMember,
  getMembers,
  getMember,
  updateMember,
  uploadImage,
  getImageFile,
  deleteMember
};
