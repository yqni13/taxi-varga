const express = require('express');
const router = express.Router();
const maintain = require('../middleware/maintenance.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const AuthController = require('../controllers/auth.controller');
const { 
    authInitSessionSchema,
} = require('../middleware/validators/authValidator.middleware')

router.post('/init', maintain(), authInitSessionSchema, awaitHandlerFactory(AuthController.initSession));

module.exports = router;