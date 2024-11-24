class MailingModel {
    sendMail = async (params = {}) => {
        return await {success: 1};
    }
}

module.exports = new MailingModel;