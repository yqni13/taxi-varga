const GoogleRoutes = require('../services/google-routes/google-routes.api');
const { NotFoundException } = require("../utils/exceptions/common.exception");
const Secrets = require('../utils/secrets.utils');
const Utils = require('../utils/common.utils');

class DrivingModel {

    // AIRPORT SERVICE
    calcAirportRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // CONFIGURE PARAMETERS
        const districtRange42 = [1, 2, 3, 4, 10, 11];
        const districtRange45 = [5, 6, 7, 8, 9, 12, 15, 20];
        const districtRange48 = [13, 14, 16, 17, 18, 19, 21, 22, 23];
        let district, price, matrixParams;

        if(params['origin'] === 'vie-schwechat') {
            district = params['destinationDetails']['zipCode'];
            matrixParams = {
                origin: params['origin'],
                destination: params['destinationDetails']['placeId'],
                useId: 'destination'
            };
        } else if(params['destination'] === 'vie-schwechat') {
            district = params['originDetails']['zipCode'];
            matrixParams = {
                origin: params['originDetails']['placeId'],
                destination: params['destination'],
                useId: 'origin'
            };
        }

        const route = await GoogleRoutes.requestMapsMatrix(matrixParams, matrixParams['useId']);
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

    // DESTINATION SERVICE
    calcDestinationRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        params['back2home'] = params['back2home'] === 'true' ? true : false;
        // manual discount: cost limit = 3h (3 * 60min)
        params['latency'] = Number(params['latency']) >= 180 ? 180 : Number(params['latency']);
        
        // GET ROUTE DATA
        const response = await GoogleRoutes.requestRouteMatrix(params);
        const home2origin = response.find(obj => { 
            return obj.originIndex === 0 && obj.destinationIndex === 1;
        });
        const origin2destination = response.find(obj => { 
            return obj.originIndex === 1 && obj.destinationIndex === 0;
        });
        const destination2origin = response.find(obj => {
            return obj.originIndex === 2 && obj.destinationIndex === 1;
        });
        const destination2home = response.find(obj => {
            return obj.originIndex === 2 && obj.destinationIndex === 2;
        });
        const origin2home = response.find(obj => {
            return obj.originIndex === 1 && obj.destinationIndex === 2;
        })

        let result = {
            price: 0,
            distance: 0,
            time: 0,
        }
        const priceApproachLess30km = 4;
        const priceApproachMore30km = 0.4;
        const priceApproachAfterHours = 0.5;
        const priceLess30km = 0.65;
        const priceMore30km = 0.5;
        const priceReturn = 0.4;
        const priceReturnAfterHours = 0.5;
        const priceLatency30min = 12;
        let approachCosts = 0;
        let withinBusinessHours = Utils.checkTimeWithinBusinessHours(params['pickupTIME']);

        if(withinBusinessHours) {
            const priceMoreThan30km = priceApproachLess30km + ((home2origin.distanceMeters - 30) * priceApproachMore30km);
            approachCosts = home2origin.distanceMeters <= 30 
                ? priceApproachLess30km
                : priceMoreThan30km;
        } else {
            const priceMoreThan8km = home2origin.distanceMeters * priceApproachAfterHours;
            approachCosts = home2origin.distanceMeters <= 8
                ? priceApproachLess30km
                : priceMoreThan8km;
        }

        let serviceDriveTimeCost = 0;
        let serviceDriveDistanceCost = 0;
        let totalServiceDistance = 0;
        let payingServiceDistance = 0;
        let totalServiceTime = 0;
        let additionalCharge = 0;

        if(params['back2home'] === true) {
            payingServiceDistance = origin2destination.distanceMeters + destination2origin.distanceMeters;
            totalServiceDistance = payingServiceDistance;
            totalServiceTime = origin2destination.duration + destination2origin.duration
        } else if(params['back2home'] === false) {
            totalServiceDistance = origin2destination.distanceMeters;
            payingServiceDistance = totalServiceDistance;
            totalServiceTime = origin2destination.duration
            additionalCharge = withinBusinessHours && (Utils.checkAddressAtViennaAirport(params.originDetails.zipCode) || Utils.checkAddressInVienna(params.originDetails.zipCode)) ? 10 : 0;
        }

        if(totalServiceDistance <= 30) {
            serviceDriveTimeCost = totalServiceTime * priceLess30km;
            serviceDriveDistanceCost = payingServiceDistance * priceLess30km;
        } else {
            serviceDriveTimeCost = totalServiceTime * priceMore30km;
            serviceDriveDistanceCost = payingServiceDistance * priceMore30km;
        }

        // first 60min cost €24,- and every started 1/2h afterwards costs €12,- 
        const latencyCosts = (params['latency'] / 60) > 1
            ? (2 * priceLatency30min) + (((params['latency'] - 60) / 30) * (priceLatency30min / 2))
            : (params['latency'] / 30) * priceLatency30min;

        const returnCosts = this.calcDestinationReturnCosts(params, origin2home, destination2home, latencyCosts, priceReturn, priceReturnAfterHours);
        const totalCosts = approachCosts + serviceDriveDistanceCost + serviceDriveTimeCost + returnCosts + additionalCharge;

        result['time'] = Math.ceil(totalServiceTime);

        result['price'] = (totalCosts % 1) >= 5
            ? Math.ceil(totalCosts)
            : Math.floor(totalCosts);

        result['distance'] = (totalServiceDistance % 1) >= 5 
            ? Math.ceil(totalServiceDistance) 
            : totalServiceDistance < 1
                ? totalServiceDistance
                : Math.floor(totalServiceDistance);

        return {routeData: result};
    }

    calcDestinationReturnCosts = (params, origin2home, destination2home, latencyCosts, priceReturn, priceReturnAfterHours) => {
        if(!Utils.checkTimeWithinBusinessHours(params['pickupTIME'])) {
            const returnDistance = params['back2home'] ? origin2home.distanceMeters : destination2home.distanceMeters;
            return (returnDistance * priceReturnAfterHours) + latencyCosts;
        }
    
        if(!params['back2home']) {
            return destination2home.distanceMeters * priceReturn;
        }
    
        let returnCosts = origin2home.distanceMeters * priceReturn;
        
        if(params['latency'] >= 180) {
            returnCosts = origin2home.distanceMeters <= 30 ? 0 : (origin2home.distanceMeters - 30) * priceReturn;
        }
    
        return returnCosts + latencyCosts;
    }
    
    // FLATRATE SERVICE
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const priceApproachPerKm = 0.5;
        const priceReturnPerKm = 0.5;
        const priceFlatrate30Min = 20;
        let totalCost = 0;

        const tenancy = (params['tenancy'] / 30) * priceFlatrate30Min; 

        const approachRoute = await GoogleRoutes.requestMapsMatrix({
            origin: Secrets.HOME_ADDRESS,
            destination: params['originDetails']['placeId']
        }, 'destination');
        const approachDistance = ((approachRoute.rows[0].elements[0].distance.value) / 1000);
        const approachCost = (approachDistance % 1) >= 5
            ? Math.ceil(approachDistance) * priceApproachPerKm
            : Math.floor(approachDistance) * priceApproachPerKm;

        if(params['origin'] !== params['destination']) {
            const returnRoute = await GoogleRoutes.requestMapsMatrix({
                origin: params['destinationDetails']['placeId'],
                destination: Secrets.HOME_ADDRESS
            }, 'origin');
            const returnDistance = ((returnRoute.rows[0].elements[0].distance.value) / 1000);
            const returnCost = (returnDistance % 1) >= 5
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