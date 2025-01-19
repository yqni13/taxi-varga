exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    };
};

exports.getTimeInMinutesFromRoutesMatrix = (value) => {
    return value === null || value === undefined ? 0 : Number((value.replaceAll('s', '') / 60).toFixed(1));
}

exports.getDistanceInKmFromRoutesMatrix = (value) => {
    return value === null || value === undefined ? 0 : Number((value / 1000).toFixed(1));
}

exports.formatRequestStringNoPlus = (value) => {
    return value === null || value === undefined ? '' : value.replaceAll('+', ' ');
}

exports.stateRegex = new RegExp(/([A-Za-zäöüÄÖÜ ])\w+/g)

exports.streetRegex = new RegExp(/([A-Za-zöäüÖÄÜ \-])\w+/g)