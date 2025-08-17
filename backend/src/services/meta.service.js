const { basicResponse } = require('../utils/common.utils');
const MetaModel = require('../models/meta.model');

class MetaService {
    getInfo() {
        const metaModel = new MetaModel();
        const result = metaModel.getInfoData();
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new MetaService;