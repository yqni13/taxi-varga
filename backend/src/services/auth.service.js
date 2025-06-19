const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');

class AuthService {
    initSession = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new AuthModel();
        const result = await model.generateToken(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new AuthService();