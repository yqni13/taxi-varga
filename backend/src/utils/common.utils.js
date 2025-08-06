const {SortingOption} = require('./enums/sorting-option.enum');

exports.basicResponse = (body, success, message) => {
    return {
        headers: { success, message },
        body: body
    };
};

exports.isObjEmpty = (obj) => {
    for(var prop in obj) {
        if(Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

exports.getTimeInMinutesFromRoutesMatrix = (value) => {
    return value === null || value === undefined ? 0 : Number((value.replaceAll('s', '') / 60).toFixed(1));
}

exports.getDistanceInKmFromRoutesMatrix = (value) => {
    return value === null || value === undefined ? 0 : Number((value / 1000).toFixed(1));
}

exports.formatRequestStringNoPlus = (value) => {
    return value === null || value === undefined ? '' : value.replaceAll('+', ' ');
}

/**
 * @param {string} time: '00:00'
 * @returns string in total minutes => "01:35" = 95
 */
exports.getTimeInTotalMinutesFromString = (time) => {
    const hours = time[0] === '0' ? Number(time[1]) : Number(`${time[0]}${time[1]}`);
    const minutes = time[3] === '0' ? Number(time[4]) : Number(`${time[3]}${time[4]}`);
    return (hours * 60) + minutes;
}

/**
 * 
 * @param {number} time 
 * @return {string} 281 => "04:41"
 */
exports.getTimeAsStringFromTotalMinutes = (time) => {
    const hours = Math.floor(time / 60);
    let minutes = (time % 60);
    minutes = (minutes % 1) >= 0.5 ? Math.ceil(minutes) : Math.floor(minutes);

    return `${hours > 9 ? hours : '0'+hours}:${minutes > 9 ? minutes : '0'+minutes}`;
}

/**
 * 
 * @param {string} start "hh:mm"
 * @param {string} adding "hh:mm"
 * @param {string} limit "hh:mm" 
 * @param {string | null | undefined} end "hh:mm"
 * @return {boolean} true if end is within limit
 */
exports.checkTimeEndingBeforeLimit = (start, adding, limit, end) => {
    if(!start || !adding || !limit) {
        return false;
    }

    limit = this.getTimeInTotalMinutesFromString(limit);
    if(!end) {
        const startInMinutes = this.getTimeInTotalMinutesFromString(start);
        const additionalInMinutes = this.getTimeInTotalMinutesFromString(adding);
        end = startInMinutes + additionalInMinutes
    }

    return end <= limit;
}

/**
 * 
 * @param {string} timestamp 'hh:mm'
 * @param {string} rangeStart 'hh:mm'
 * @param {string} rangeEnd 'hh:mm'
 * @return {boolean} true if timestamp within time range (start to end)
 */
exports.isTimeStartingWithinRange = (timestamp, rangeStart, rangeEnd) => {
    if(!timestamp || !rangeStart || !rangeEnd) {
        return false;
    }

    timestamp = this.getTimeInTotalMinutesFromString(timestamp);
    const start = this.getTimeInTotalMinutesFromString(rangeStart);
    const end = this.getTimeInTotalMinutesFromString(rangeEnd);

    return timestamp >= start && timestamp <= end;
}

exports.checkAddressInViennaByZipCode = (zipCode) => {
    if(!zipCode) {
        return false;
    }
    const postalCodesVienna = ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230'];

    return postalCodesVienna.includes(String(zipCode));
}

exports.checkAddressInViennaByProvince = (province) => {
    if(!province) {
        return false;
    }
    const vienna = ['wien', 'vienna'];
    province = province.toString().toLowerCase();

    return vienna.includes(province);
}

exports.checkAddressInLowerAustriaByProvince = (province) => {
    if(!province) {
        return false;
    }
    const lowerAustria = ['niederösterreich', 'lower austria'];
    province = province.toString().toLowerCase();

    return lowerAustria.includes(province);
}

exports.checkAddressAtViennaAirport = (zipCode) => {
    if(!zipCode) {
        return false;
    }
    const postalCodesViennaAirport = ['1300'];
    return postalCodesViennaAirport.includes(String(zipCode));
}

exports.checkTimeWithinBusinessHours = (hour) => {
    return !hour ? false : (hour > 3 && hour < 13);
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
