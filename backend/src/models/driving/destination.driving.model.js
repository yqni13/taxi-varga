const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const Utils = require('../../utils/common.utils');
const { ServiceOption } = require('../../utils/enums/service-option.enum');

class DrivingDestinationModel {
    calcDestinationRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        params['back2home'] = params['back2home'] === 'true' ? true : false;
        // manual discount: cost limit = 3h (3 * 60min)
        params['latency'] = Number(params['latency']) >= 180 ? 180 : Number(params['latency']);

        // GET ROUTE DATA
        const response = await GoogleRoutes.requestRouteMatrix(params, ServiceOption.DESTINATION);
        // h2o: home to origin
        // o2d: origin to destination
        // d2o: destination to origin
        // d2h: destination to home
        // o2h: origin to home
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
            o2h: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
        }
        let result = {
            price: 0,
            distance: 0,
            duration: 0,
        }
        const prices = {
            approachBelow30Km: 4,
            approachAbove30Km: 0.4,
            approachOffBH: 0.5,
            below30Km: 0.65,
            above30Km: 0.5,
            returnWithinBH: 0.4,
            returnOffBH: 0.5,
            latencyBy30Min: 12
        }
        let approachCosts = 0;
        let withinBusinessHours = Utils.checkTimeWithinBusinessHours(params['pickupTIME']);

        // Approach costs
        if(withinBusinessHours) {
            const priceMoreThan30km = prices.approachBelow30Km + ((routes.h2o.distanceMeters - 30) * prices.approachAbove30Km);
            approachCosts = routes.h2o.distanceMeters <= 30 
                ? prices.approachBelow30Km
                : priceMoreThan30km;
        } else {
            const priceMoreThan8km = routes.h2o.distanceMeters * prices.approachOffBH;
            approachCosts = routes.h2o.distanceMeters <= 8
                ? prices.approachBelow30Km
                : priceMoreThan8km;
        }

        let serviceDriveTimeCost = 0;
        let serviceDriveDistanceCost = 0;
        let totalServiceDistance = 0;
        let payingServiceDistance = 0;
        let totalServiceTime = 0;
        let additionalCharge = 0;

        if(params['back2home'] === true) {
            payingServiceDistance = routes.o2d.distanceMeters + routes.d2o.distanceMeters;
            totalServiceDistance = payingServiceDistance;
            totalServiceTime = routes.o2d.duration + routes.d2o.duration;
        } else if(params['back2home'] === false) {
            totalServiceDistance = routes.o2d.distanceMeters;
            payingServiceDistance = totalServiceDistance;
            totalServiceTime = routes.o2d.duration;
        }

        if(totalServiceDistance <= 30) {
            serviceDriveTimeCost = totalServiceTime * prices.below30Km;
            serviceDriveDistanceCost = payingServiceDistance * prices.below30Km;
        } else {
            serviceDriveTimeCost = totalServiceTime * prices.above30Km;
            serviceDriveDistanceCost = payingServiceDistance * prices.above30Km;
        }

        // first 60min cost €24,- and every started 1/2h afterwards costs €12,- 
        const latencyCosts = (params['latency'] / 60) > 1
            ? (2 * prices.latencyBy30Min) + (((params['latency'] - 60) / 30) * (prices.latencyBy30Min / 2))
            : (params['latency'] / 30) * prices.latencyBy30Min;

        const returnCosts = this.#calcDestinationReturnCosts(params, routes, latencyCosts, prices);

        // Add up all additional charges
        additionalCharge += this.#addChargeParkFlatByBH(params, withinBusinessHours)
        additionalCharge += this.#addChargeServiceDistanceBelow30Km(routes, 0.4);

        const totalCosts = approachCosts + serviceDriveDistanceCost + serviceDriveTimeCost + returnCosts + additionalCharge;

        result['duration'] = Math.ceil(totalServiceTime);
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

    #calcDestinationReturnCosts = (params, routes, latencyCosts, prices) => {
        if(!Utils.checkTimeWithinBusinessHours(params['pickupTIME'])) {
            const returnDistance = params['back2home'] ? routes.o2h.distanceMeters : routes.d2h.distanceMeters;
            return (returnDistance * prices.returnOffBH) + latencyCosts;
        }
    
        if(!params.back2home) {
            return routes.d2h.distanceMeters * prices.returnWithinBH;
        }
    
        let returnCosts = routes.o2h.distanceMeters * prices.returnWithinBH;
        
        if(params['latency'] >= 180) {
            returnCosts = routes.o2h.distanceMeters <= 30 
                ? 0 
                : (routes.o2h.distanceMeters - 30) * prices.returnWithinBH;
        }
    
        return returnCosts + latencyCosts;
    }

    #addChargeServiceDistanceBelow30Km = (routes, price) => {
        let charge = 0;
        const serviceDistance = routes.back2home 
            ? routes.o2d.distanceMeters + routes.d2o.distanceMeters 
            : routes.o2d.distanceMeters;

        if(serviceDistance > 30) {
            return charge;
        }

        // Additional charge on approach
        charge += routes.h2o.distanceMeters * price;
        // Additional charge on return home
        const returnDistance = routes.back2home ? routes.o2h.distanceMeters : routes.d2h.distanceMeters;
        charge += returnDistance * price;

        return charge;
    }

    #addChargeParkFlatByBH(params, isWithinBH) {
        let charge = 0;
        if(params.back2home) {
            return charge;
        }
        const priceFlatrateWithinBH = 14;
        const priceFlatrateOffBH = 6;
        const zipCode = params.originDetails.zipCode;
        charge = isWithinBH && (Utils.checkAddressAtViennaAirport(zipCode) || Utils.checkAddressInVienna(zipCode)) 
            ? priceFlatrateWithinBH
            : (!Utils.checkAddressInVienna(zipCode) && !Utils.checkAddressAtViennaAirport(zipCode)) 
                ? 0 
                : priceFlatrateOffBH;
        
        return charge;
    }
}

module.exports = new DrivingDestinationModel;