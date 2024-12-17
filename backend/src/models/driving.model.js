const { NotFoundException } = require("../utils/exceptions/common.exception");
require('dotenv').config();
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

        params['back2home'] = params['back2home'] === 'true' ? true : false;
        let result = {
            price: 0,
            distance: 0,
            time: 0
        }
        const priceApproachLess8km = 4;
        const priceApproachMore8km = 0.5;
        const priceLess30km = 0.65;
        const priceMore30km = 0.5;
        const priceReturn = 0.5;

        //home -> customer departure address (h2cda)
        let approachCosts = 0;
        const h2cda = await GoogleAPI.requestDistanceMatrix({
            origins: process.env.HOME_ADDRESS,
            destinations: params['origins']
        });

        if(h2cda.rows[0].elements[0].distance.value <= 8000) {
            approachCosts = priceApproachLess8km;
        } else {
            approachCosts = Math.floor(h2cda.rows[0].elements[0].distance.value / 1000) * priceApproachMore8km;
        }

        // customer departure address -> customer arrival address (serviceDrive)
        const serviceDrive = await GoogleAPI.requestDistanceMatrix(params);

        // return to home
        let homeReturn = 0;
        let serviceDriveTimeCost = 0;
        let serviceDriveWayCost = 0;
        let totalServiceDistance = 0
        let totalServiceTime = 0;
        if(params['back2home'] === true) {
            totalServiceDistance = ((serviceDrive.rows[0].elements[0].distance.value) * 2) / 1000;
            totalServiceTime = ((serviceDrive.rows[0].elements[0].duration.value) * 2) / 60;
        } else if(params['back2home'] === false) {
            totalServiceDistance = (serviceDrive.rows[0].elements[0].distance.value) / 1000;
            totalServiceTime = (serviceDrive.rows[0].elements[0].duration.value) / 60;
            homeReturn = await GoogleAPI.requestDistanceMatrix({
                origins: params['destinations'],
                destinations: process.env.HOME_ADDRESS
            });
        }

        if(totalServiceDistance <= 30) {
            serviceDriveTimeCost = totalServiceTime * priceLess30km;
            serviceDriveWayCost = totalServiceDistance * priceLess30km;
        } else {
            serviceDriveTimeCost = totalServiceTime * priceMore30km;
            serviceDriveWayCost = totalServiceDistance * priceMore30km;
        }

        const homeReturnPrice = params['back2home'] === true
            ? approachCosts 
            : (homeReturn.rows[0].elements[0].distance.value / 1000) * priceReturn;

        result['price'] = approachCosts + serviceDriveWayCost + serviceDriveTimeCost + homeReturnPrice;
        result['distance'] = totalServiceDistance;
        result['time'] = totalServiceTime;

        return {routeData: result};
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