const { MaintenanceException } = require('../utils/exceptions/common.exception');
const Secrets = require('../utils/secrets.utils');

const maintain = () => {
    return async function (req, res, next) {
        try {
            if(Secrets.MAINTENANCE_CODE !== 'maintenance-code-0') {
                throw new MaintenanceException(Secrets.MAINTENANCE_CODE);
            }
            next();
        } catch(error) {
            console.log("MAINTENANCE ERROR ON API CALL: ", error.message);
            next(error);
        }
    }
}

module.exports = maintain;