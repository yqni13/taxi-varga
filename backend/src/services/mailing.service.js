const { basicResponse } = require('../utils/common.utils');
const MailingModel = require('../models/mailing.model');

class MailingService {
    sendMail = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let mail = await MailingModel.sendMail(hasParams ? params : {});
        return basicResponse(mail, 1, "Success");
    }
}

module.exports = new MailingService;