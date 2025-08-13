const MetaService = require('../services/meta.service');

class MetaController {
    getInfo(req, res, next) {
        const response = MetaService.getInfo();
        res.send(response);
    }
}

module.exports = new MetaController;