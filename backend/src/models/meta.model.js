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
            "version": "1.6.3",
        };
    }
}

module.exports = MetaModel;