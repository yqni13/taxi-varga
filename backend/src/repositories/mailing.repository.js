const { basicResponse } = require('../utils/common.utils');
const MailingModel = require('../models/mailing.model');
const { UnexpectedException } = require('../utils/exceptions/common.exception');

class MailingRepository {
    sendMail = async (params) => {
        let mail = await MailingModel.sendMail(params);
        if(!mail) {
            throw new UnexpectedException('No logic to handle mail yet');
        }

        return basicResponse(mail, 1, "Success");
    }
}

module.exports = new MailingRepository;