const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const maintain = require('../middleware/maintenance.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const mailingController = require('../controllers/mailing.controller');
const { mailingSchema } = require('../middleware/validators/mailingValidator.middleware');

router.post('/send', maintain(), auth(), mailingSchema, awaitHandlerFactory(mailingController.createMail));

module.exports = router;