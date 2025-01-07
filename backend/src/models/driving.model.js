const { NotFoundException } = require("../utils/exceptions/common.exception");
const Utils = require("../utils/common.utils")
require('dotenv').config();
const GoogleAPI = require('../services/google-api.service');

class DrivingModel {
    calcAirportRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // CONFIGURE PARAMETERS
        const districtRange42 = [11, 10, 3, 2, 4, 1];
        const districtRange45 = [5, 6, 7, 8, 9, 12, 15, 20];
        const districtRange48 = [13, 14, 16, 17, 18, 19, 21, 22, 23];
        let district, price;

        if(params['origin'] === 'vie-schwechat') {
            district = Utils.getZipCode(params['destination']);
        } else if(params['destination'] === 'vie-schwechat') {
            district = Utils.getZipCode(params['origin']);
        }

        // GOOGLE ROUTE CALC
        const route = await GoogleAPI.requestDistanceMatrix({
            origin: params['origin'], 
            destination: params['destination']
        });
        const distance = (route.rows[0].elements[0].distance.value) / 1000 // result divided by 1000 to get total km
        const duration = (route.rows[0].elements[0].duration.value) / 60 // result divided by 60 to get total minutes

        // PRICE CALC BASED ON ZIPCODE
        district = Number(district.slice(1,3));
        if(districtRange42.includes(district)) {
            price = 42;
        } else if(districtRange45.includes(district)) {
            price = 45;
        } else if(districtRange48.includes(district)) {
            price = 48;
        } else {
            throw new NotFoundException('Vienna zip code not found');
        }

        return {
            routeData: {
                duration: Math.ceil(duration),
                distance: Math.ceil(distance),
                price: price
            }
        };
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

        //home to customer departure address (h2cda)
        let approachCosts = 0;
        const h2cda = await GoogleAPI.requestDistanceMatrix({
            origin: process.env.HOME_ADDRESS,
            destination: params['origin']
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
                origin: params['destination'],
                destination: process.env.HOME_ADDRESS
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

        result['price'] = Math.floor(approachCosts + serviceDriveWayCost + serviceDriveTimeCost + homeReturnPrice);
        result['distance'] = (totalServiceDistance % 1 > 5) 
            ? Math.ceil(totalServiceDistance) 
            : Math.floor(totalServiceDistance);
        result['time'] = Math.ceil(totalServiceTime);

        return {routeData: result};
    }
    
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const priceApproachPerKm = 0.5;
        const priceReturnPerKm = 0.5;
        const priceFlatratePerHour = 40;
        let totalCost = 0;

        const tenancy = params['tenancy'] * priceFlatratePerHour; 

        const approachRoute = await GoogleAPI.requestDistanceMatrix({
            origin: process.env.HOME_ADDRESS,
            destination: params['origin']
        });
        const approachDistance = ((approachRoute.rows[0].elements[0].distance.value) / 1000);
        const approachCost = (approachDistance % 1) > 5
            ? Math.ceil(approachDistance) * priceApproachPerKm
            : Math.floor(approachDistance) * priceApproachPerKm;

        if(params['origin'] !== params['destination']) {
            const returnRoute = await GoogleAPI.requestDistanceMatrix({
                origin: params['destination'],
                destination: process.env.HOME_ADDRESS
            });
            const returnDistance = ((returnRoute.rows[0].elements[0].distance.value) / 1000);
            const returnCost = (returnDistance % 1) > 5
                ? Math.ceil(returnDistance) * priceReturnPerKm
                : Math.floor(returnDistance) * priceReturnPerKm;
            totalCost = tenancy + approachCost + returnCost;
        } else {
            totalCost = tenancy + (approachCost * 2);
        }

        return { 
            routeData: {
                price: Math.ceil(totalCost)
            }
        };
    }
}

module.exports = new DrivingModel;