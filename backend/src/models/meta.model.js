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
            "version": "1.6.11",
        };
    }
}

module.exports = MetaModel;