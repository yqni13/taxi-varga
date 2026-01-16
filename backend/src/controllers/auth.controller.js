const AuthService = require('../services/auth.service');
const checkValidation = require('../middleware/validation.middleware');

class AuthController {
    async initSession(req, res, next) {
        checkValidation(req);
        const response = await AuthService.initSession(req.body);
        res.send(response);
    }
}

module.exports = new AuthController();