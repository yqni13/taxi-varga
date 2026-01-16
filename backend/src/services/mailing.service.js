const { basicResponse } = require('../utils/common.utils');
const MailingModel = require('../models/mailing.model');

class MailingService {
    async sendMail(params) {
        const mail = await MailingModel.sendMail(params);
        return basicResponse(mail, 1, "Success");
    }
}

module.exports = new MailingService;