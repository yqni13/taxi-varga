const AuthService = require('../services/auth.service');
const checkValidation = require('../middleware/validation.middleware');

class AuthController {
    async initSession(req, res, next) {
        try {
            checkValidation(req);
            const response = await AuthService.initSession(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new AuthController();