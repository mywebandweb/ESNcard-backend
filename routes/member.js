'user strict'

var express = require('express');
var MemberController = require('../controllers/member');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/members' });

api.get('/pruebas-members', md_auth.ensureAuth, MemberController.pruebas);
api.post('/member', [md_auth.ensureAuth, md_admin.isAdmin], MemberController.saveMember);
api.get('/members', MemberController.getMembers);
api.get('/member/:id', MemberController.getMember);
api.put('/member/:id', [md_auth.ensureAuth, md_admin.isAdmin], MemberController.updateMember);
api.post('/upload-image-member/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], MemberController.uploadImage);
api.get('/get-image-member/:imageFile', MemberController.getImageFile);
api.delete('/member/:id', [md_auth.ensureAuth, md_admin.isAdmin], MemberController.deleteMember);

module.exports = api;
