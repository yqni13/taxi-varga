const {SortingOption} = require('./enums/sorting-option.enum');

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

exports.checkAddressInVienna = (zipCode) => {
    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230'];

    return postalCodesVienna.includes(String(zipCode));
}

exports.checkAddressAtViennaAirport = (zipCode) => {
    const postalCodesViennaAirport = ['1300'];
    return postalCodesViennaAirport.includes(String(zipCode));
}

exports.checkTimeWithinBusinessHours = (hour) => {
    return (hour > 3 && hour < 13)
}

/**
 * 
 * @param {*} data any[]
 * @param {SortingOption} direction ascending/descending
 * @param {string | null} target (nested) property of obj to target sorting or null
 * @returns 
 */
exports.quicksort = (data, direction, target = undefined) => {
    if(data.length <= 1) {
        return data;
    }

    let pivot = data[0];
    let leftArr = [];
    let rightArr = [];

    for(let i = 1; i < data.length; i++) {
        const compareData = target 
            ? target.split('.').reduce((prev, curr) => prev?.[curr], data[i])
            : data[i];
        const comparePivot = target 
            ? target.split('.').reduce((prev, curr) => prev?.[curr], pivot)
            : pivot;
        if(direction === SortingOption.ASC) {
            if(compareData < comparePivot) {
                leftArr.push(data[i]);
            } else {
                rightArr.push(data[i]);
            }
        } else {
            if(compareData > comparePivot) {
                leftArr.push(data[i]);
            } else {
                rightArr.push(data[i]);
            }
        }
    }

    return [
        ...this.quicksort(leftArr, direction, target),
        pivot,
        ...this.quicksort(rightArr, direction, target)
    ];
}