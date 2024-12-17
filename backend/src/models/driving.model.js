const { NotFoundException } = require("../utils/exceptions/common.exception");

const GoogleAPI = require('../services/google-api.service');

class DrivingModel {
    calcAirportRoute = (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const districtRange42 = [11, 10, 3, 2, 4, 1];
        const districtRange45 = [5, 6, 7, 8, 9, 12, 15, 20];
        const districtRange48 = [14, 16, 17, 18, 19, 21, 22, 23];
        const district = Number(params['zipCode'].slice(1,3));
        let price;

        if(districtRange42.includes(district)) {
            price = 42;
        } else if(districtRange45.includes(district)) {
            price = 45;
        } else if(districtRange48.includes(district)) {
            price = 48;
        } else {
            throw new NotFoundException('Vienna zip code not found');
        }
        
        return {price: price};
    }

    calcDestinationRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const routeData = await GoogleAPI.requestDistanceMatrix(params);
        return {routeData};
    }
    
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        
        const routeData = GoogleAPI;

        return {};
    }
}

module.exports = new DrivingModel;