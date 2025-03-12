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

exports.checkAddressInVienna = (zipCode) => {
    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230', '2333'];

    return postalCodesVienna.includes(String(zipCode));
}

exports.checkAddressAtViennaAirport = (zipCode) => {
    const postalCodesViennaAirport = ['1300'];
    return postalCodesViennaAirport.includes(String(zipCode));
}

exports.checkTimeWithinBusinessHours = (hour) => {
    return (hour > 3 && hour < 13)
} 