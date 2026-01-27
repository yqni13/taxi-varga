const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');

class AuthService {
    async initSession(params) {
        const authModel = new AuthModel();
        const result = await authModel.generateToken(params);
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new AuthService();