const Utils = require('../../utils/common.utils');
const { ServiceOption } = require('../../utils/enums/service-option.enum');

class DrivingDestinationModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            approachFlatrate: 4,
            approachWithinBH: 0.4,
            approachOffBH: 0.5,
            servDistBelow25Km: 0.6,
            servDistAbove25Km: 0.5,
            servDistBelow30Km: 0.65,
            servDistAbove30Km: 0.5,
            returnWithinBH: 0.4,
            returnOffBH: 0.5,
            latencyBy30Min: 12,
            parkFlat: 10,
            discountLA2VIA: 6
        };
    }

    calcDestinationRoute = async (params) => {
        params['back2home'] = params['back2home'] === 'true' ? true : false;
        // Manual discount: cost limit = 3h (3 * 60min)
        params['latency'] = Number(params['latency']) >= 180 ? 180 : Number(params['latency']);
        // Price is calculated by every started 30 minute-block.
        params['latency'] = (Math.ceil(params['latency'] / 30)) * 30; 
        const pickUp = Utils.getTimeAsStringFromTotalMinutes(Number(params['pickupTIME']) * 60);

        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.DESTINATION);
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
            o2h: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
        };

        let result = {
            price: 0,
            distance: 0,
            duration: 0
        };
        const isWithinBH = Utils.checkTimeWithinBusinessHours(params['pickupTIME']);
        const servDist = params['back2home'] 
            ? (routes.o2d.distanceMeters + routes.d2o.distanceMeters)
            : routes.o2d.distanceMeters;
        const servTime = params['back2home']
            ? routes.o2d.duration + routes.d2o.duration
            : routes.o2d.duration;

        // Approach costs
        const approachPricePerKm = isWithinBH ? this.#prices.approachWithinBH : this.#prices.approachOffBH;
        const approachCosts = routes.h2o.distanceMeters <= 20
            ? this.#prices.approachFlatrate
            : this.#prices.approachFlatrate + ((routes.h2o.distanceMeters - 20) * approachPricePerKm);

        const servCosts = this._calcServCosts(params.back2home, servDist, servTime);
        const returnCosts = this._calcDestinationReturnCosts(params, routes, isWithinBH);

        // First 60min every started 1/2h costs €12,- afterwards costs €6,-
        const latencyCosts = (params['latency'] / 60) > 1
            ? (2 * this.#prices.latencyBy30Min) + (((params['latency'] - 60) / 30) * (this.#prices.latencyBy30Min / 2))
            : (params['latency'] / 30) * this.#prices.latencyBy30Min;

        // Add up all additional charges.
        let additionalCharge = 0;
        additionalCharge += latencyCosts;
        additionalCharge += this._addChargeParkFlatByBH(params, servDist);

        // Add up all discounts to substract.
        let discounts = 0;
        discounts += this._calcDiscountLaToVIA(params.originDetails, params.destinationDetails, servDist, pickUp);

        const totalCosts = approachCosts + servCosts.dist + servCosts.time + returnCosts + additionalCharge - discounts;

        result['duration'] = Math.ceil(servTime);
        result['price'] = (totalCosts % 1) >= 0.5
            ? Math.ceil(totalCosts)
            : Math.floor(totalCosts);
        result['distance'] = (servDist % 1) >= 0.5
            ? Math.ceil(servDist) 
            : servDist < 1
                ? servDist
                : Math.floor(servDist);

        return {routeData: result};
    }

    _calcServCosts = (back2home, servDist, servTime) => {
        let [distCosts, timeCosts, servPrice] = [0, 0, 0];
        if(back2home) {
            servPrice = servDist <= 30 ? this.#prices.servDistBelow30Km : this.#prices.servDistAbove30Km;
        } else {
            servPrice = servDist <= 25 ? this.#prices.servDistBelow25Km : this.#prices.servDistAbove25Km;
        }
        distCosts = servDist * servPrice;
        timeCosts = servTime * servPrice;

        return { dist: distCosts, time: timeCosts };
    }

    _calcDestinationReturnCosts = (params, routes, isWithinBH) => {
        if(!isWithinBH) {
            const returnDistance = params['back2home'] ? routes.o2h.distanceMeters : routes.d2h.distanceMeters;
            return Number((returnDistance * this.#prices.returnOffBH).toFixed(1));
        }

        if(!params.back2home) {
            return Number((routes.d2h.distanceMeters * this.#prices.returnWithinBH).toFixed(1));
        }

        let returnCosts = routes.o2h.distanceMeters * this.#prices.returnWithinBH;

        if(params['latency'] >= 180) {
            returnCosts = routes.o2h.distanceMeters <= 30 
                ? 0 
                : (routes.o2h.distanceMeters - 30) * this.#prices.returnWithinBH;
        }
    
        return Number((returnCosts).toFixed(1));
    }

    
    _calcDiscountLaToVIA = (originDetails, destinationDetails, servDist, pickUp) => {
        const isOriginLA = Utils.checkAddressInLowerAustriaByProvince(originDetails.province ?? null);
        const isDestinationVIA = Utils.checkAddressAtViennaAirport(destinationDetails.zipCode ?? null);
        if(servDist <= 40) {
            const isTimeWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '09:59');
            return isTimeWithinRange && isOriginLA && isDestinationVIA ? this.#prices.discountLA2VIA : 0;
        }
        if(servDist > 40 && servDist <= 55) {
            const isTimeWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '05:59');
            return isTimeWithinRange && isOriginLA && isDestinationVIA ? this.#prices.discountLA2VIA : 0;
        }
        return 0;
    }

    _addChargeParkFlatByBH(params, servDist) {
        let charge = 0;
        if(params.back2home || servDist > 60) {
            return charge;
        }

        let zipCode = '';
        if(!params.originDetails.zipCode && params.originDetails.province) {
            zipCode = Utils.checkAddressInViennaByProvince(params.originDetails.province) ? '1010' : '0000';
        } else {
            zipCode = params.originDetails.zipCode;
        }

        charge = Utils.checkAddressAtViennaAirport(zipCode) || Utils.checkAddressInViennaByZipCode(zipCode) 
            ? this.#prices.parkFlat 
            : 0;

        return charge;
    }
}

module.exports = DrivingDestinationModel;