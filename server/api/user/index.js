'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',  controller.list);
router.get('/stats', auth.hasRole('admin'), controller.stats);
router.get('/:id/commits', controller.commits);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id/deactivate', auth.isAuthenticated(), controller.deactivate);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.get("/:id/attendance", controller.attendance);

module.exports = router;
