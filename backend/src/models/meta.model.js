const Secrets = require('../utils/secrets.utils');

class MetaModel {

    constructor() {
        //
    }
    
    getInfoData() {
        return {
            "app": "taxi-varga",
            "author": "yqni13",
            "environment": Secrets.MODE,
            "maintenance-code": Secrets.MAINTENANCE_CODE,
            "version": "1.6.15",
        };
    }
}

module.exports = MetaModel;