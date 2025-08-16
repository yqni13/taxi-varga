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
            servDistBelow30Km: 0.65,
            servDistAbove30Km: 0.5,
            servDistBelow15Km: 0.7,
            servDistFrom15to30Km: 0.6,
            returnWithinBH: 0.4,
            returnOffBH: 0.5,
            latencyBy30Min: 12,
            parkFlatWithinBH: 14,
            parkFlatOffBH: 6,
            discountLa2VIA: 6
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
        let approachCosts = 0;
        const isWithinBH = Utils.checkTimeWithinBusinessHours(params['pickupTIME']);
        const servDist = params['back2home'] 
            ? (routes.o2d.distanceMeters + routes.d2o.distanceMeters)
            : routes.o2d.distanceMeters;
        const servTime = params['back2home']
            ? routes.o2d.duration + routes.d2o.duration
            : routes.o2d.duration;

        // Approach costs
        if(isWithinBH) {
            const priceMoreThan30km = this.#prices.approachFlatrate + ((routes.h2o.distanceMeters - 30) * this.#prices.approachWithinBH);
            approachCosts = servDist <= 15 
                ? this.#prices.approachFlatrate + (routes.h2o.distanceMeters * this.#prices.approachWithinBH)
                : routes.h2o.distanceMeters <= 30
                    ? this.#prices.approachFlatrate
                    : priceMoreThan30km;
        } else {
            approachCosts = this.#prices.approachFlatrate + (routes.h2o.distanceMeters * this.#prices.approachOffBH)
        }

        const servCosts = this._calcServCosts(params.back2home, servDist, servTime);
        const returnCosts = this._calcDestinationReturnCosts(params, routes, isWithinBH);
        
        // first 60min cost €24,- and every started 1/2h afterwards costs €12,- 
        const latencyCosts = (params['latency'] / 60) > 1
            ? (2 * this.#prices.latencyBy30Min) + (((params['latency'] - 60) / 30) * (this.#prices.latencyBy30Min / 2))
            : (params['latency'] / 30) * this.#prices.latencyBy30Min;

        let additionalCharge = 0;
        let discounts = 0;

        // Add up all additional charges.
        additionalCharge += latencyCosts;
        additionalCharge += this._addChargeParkFlatByBH(params, isWithinBH)

        // TODO(yqni13): remove 09/2025
        // additionalCharge += this._addChargeServiceDistanceBelow20Km(routes, params['back2home'], 0.4);

        // Add up all discounts to substract.
        discounts += this._calcDiscountLaToVIA4To10(params.originDetails, params.destinationDetails, servDist, pickUp);

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
        let distCosts, timeCosts = 0;
        if(back2home) {
            const servPrice = servDist <= 30 ? this.#prices.servDistBelow30Km : this.#prices.servDistAbove30Km;
            distCosts = servDist * servPrice;
            timeCosts = servTime * servPrice;
        } else {
            const servPrice = servDist <= 15 
                ? this.#prices.servDistBelow15Km 
                : servDist > 30 
                    ? this.#prices.servDistAbove30Km : this.#prices.servDistFrom15to30Km
            distCosts = servDist * servPrice;
            timeCosts = servTime * servPrice;
        }

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

    _calcDiscountLaToVIA4To10 = (originDetails, destinationDetails, servDist, pickUp) => {
        if(servDist <= 35) {
            const isOriginLA = Utils.checkAddressInLowerAustriaByProvince(originDetails.province ?? null);
            const isDestinationVIA = Utils.checkAddressAtViennaAirport(destinationDetails.zipCode ?? null);
            const isTimeWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '10:00');
            return isTimeWithinRange && isOriginLA && isDestinationVIA ? this.#prices.discountLa2VIA : 0;
        }
        return 0;
    }

    // TODO(yqni13): remove 09/2025
    /**
     * @deprecated since version 1.5.8
     */
    _addChargeServiceDistanceBelow20Km = (routes, back2home, price) => {
        let charge = 0;
        const serviceDistance = back2home 
            ? routes.o2d.distanceMeters + routes.d2o.distanceMeters 
            : routes.o2d.distanceMeters;
        if(serviceDistance > 20) {
            return charge;
        }

        // Additional charge on approach
        charge += routes.h2o.distanceMeters * price;
        // Additional charge on return home
        const returnDistance = back2home ? routes.o2h.distanceMeters : routes.d2h.distanceMeters;
        charge += returnDistance * price;

        return Number((charge).toFixed(1));
    }

    _addChargeParkFlatByBH(params, isWithinBH) {
        let charge = 0;
        if(params.back2home) {
            return charge;
        }

        let zipCode = '';
        if(!params.originDetails.zipCode && params.originDetails.province) {
            zipCode = Utils.checkAddressInViennaByProvince(params.originDetails.province) ? '1010' : '0000';
        } else {
            zipCode = params.originDetails.zipCode;
        }

        charge = isWithinBH && (Utils.checkAddressAtViennaAirport(zipCode) || Utils.checkAddressInViennaByZipCode(zipCode)) 
            ? this.#prices.parkFlatWithinBH
            : (!Utils.checkAddressInViennaByZipCode(zipCode) && !Utils.checkAddressAtViennaAirport(zipCode)) 
                ? 0 
                : this.#prices.parkFlatOffBH;
        
        return charge;
    }
}

module.exports = DrivingDestinationModel;