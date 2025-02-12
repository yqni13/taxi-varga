const { ServiceOption } = require('./enums/service-option.enum');

exports.validateServiceOption = (value) => {
    const options = Object.values(ServiceOption);
    if(!options.includes(value)) {
        throw new Error('backend-service-option');
    }
    return true;
}