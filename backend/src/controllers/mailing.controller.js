const MailingService = require('../services/mailing.service');
const checkValidation = require('../middleware/validation.middleware');

class MailingController {
    async createMail(req, res, next) {
        try {
            checkValidation(req);
            const response = await MailingService.sendMail(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new MailingController;