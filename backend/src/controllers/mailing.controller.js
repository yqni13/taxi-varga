const MailingService = require('../services/mailing.service');
const { checkValidation } = require('../middleware/validation.middleware');

class MailingController {
    createMail = async (req, res, next) => {
        checkValidation(req);
        const response = await MailingService.sendMail(req.body);
        res.send(response);
    }
}

module.exports = new MailingController;