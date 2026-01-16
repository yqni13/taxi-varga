const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');

class AuthService {
    async initSession(params) {
        const hasParams = Object.keys(params).length !== 0;
        const authModel = new AuthModel();
        const result = await authModel.generateToken(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new AuthService();