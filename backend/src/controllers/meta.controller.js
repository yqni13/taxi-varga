const MetaService = require('../services/meta.service');

class MetaController {
    getInfo(req, res, next) {
        try {
            const response = MetaService.getInfo();
            res.send(response);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new MetaController;