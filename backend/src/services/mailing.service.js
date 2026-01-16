const { basicResponse } = require('../utils/common.utils');
const MailingModel = require('../models/mailing.model');

class MailingService {
    async sendMail(params) {
        const hasParams = Object.keys(params).length !== 0;
        const mail = await MailingModel.sendMail(hasParams ? params : {});
        return basicResponse(mail, 1, "Success");
    }
}

module.exports = new MailingService;