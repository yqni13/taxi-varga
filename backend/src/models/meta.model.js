const Secrets = require('../utils/secrets.utils');

class MetaModel {
    static _instance;

    static getInstance() {
        if(!MetaModel._instance) {
            MetaModel._instance = new MetaModel();
        }
        return MetaModel._instance;
    }

    getInfoData() {
        return {
            "app": "taxi-varga",
            "author": "yqni13",
            "environment": Secrets.MODE,
            "maintenance-code": Secrets.MAINTENANCE_CODE,
            "version": "1.8.2",
        };
    }
}

module.exports = MetaModel;