const Utils = require('../../utils/common.utils');
const { ServiceOption } = require('../../utils/enums/service-option.enum');

class DrivingDestinationModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            base: 4,
            approach: {
                offBH: 0.5,
                withinBH: {
                    low: 0.4,
                    mid: 0.45,
                    high: 0.5
                }
            },
            return: {
                offBH: 0.5,
                withinBH: {
                    low: 0.4,
                    mid: 0.45,
                    high: 0.5
                }
            },
            servDist: {
                below25Km: 0.6,
                below30Km: 0.65,
                above25Km: 0.5,
                above30Km: 0.5
            },
            latency: {
                per30Min: 12
            },
            parking: {
                base: 10
            },
            discount: {
                la2via: 6
            }
        }
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
        const approachCalcDistParams = { approach: routes.h2o.distanceMeters, service: servDist };
        const approachCosts = this._calcApproachCosts(isWithinBH, approachCalcDistParams, params.back2home);

        const servCosts = this._calcServCosts(params.back2home, servDist, servTime);
        const returnCosts = this._calcReturnCosts(params, routes, isWithinBH);

        // First 60min every started 1/2h costs €12,- afterwards costs €6,-
        const latencyPrice = this.#prices.latency.per30Min;
        const latencyCosts = (params['latency'] / 60) > 1
            ? (2 * latencyPrice) + (((params['latency'] - 60) / 30) * (latencyPrice / 2))
            : (params['latency'] / 30) * latencyPrice;

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
            servPrice = servDist <= 30 ? this.#prices.servDist.below30Km : this.#prices.servDist.above30Km;
        } else {
            servPrice = servDist <= 25 ? this.#prices.servDist.below25Km : this.#prices.servDist.above25Km;
        }
        distCosts = servDist * servPrice;
        timeCosts = servTime * servPrice;

        return { dist: distCosts, time: timeCosts };
    }

    _calcApproachCosts(isWithinBH, distances, back2home) {
        const servDistRules = [
            { max: 100, b2h: true, apply: (inTime) => inTime ? this.#prices.approach.withinBH.low : this.#prices.approach.offBH },
            { max: 100, b2h: false, apply: (inTime) => inTime ? this.#prices.approach.withinBH.low : this.#prices.approach.offBH },
            { max: 250, b2h: true, apply: (inTime) => inTime ? this.#prices.approach.withinBH.low : this.#prices.approach.offBH },
            { max: 250, b2h: false, apply: (inTime) => inTime ? this.#prices.approach.withinBH.mid : this.#prices.approach.offBH },
            { max: Infinity, b2h: true, apply: (inTime) => inTime ? this.#prices.approach.withinBH.low : this.#prices.approach.offBH },
            { max: Infinity, b2h: false, apply: (inTime) => inTime ? this.#prices.approach.withinBH.high : this.#prices.approach.offBH }
        ];

        const price = servDistRules.find(rule => distances.service < rule.max && back2home === rule.b2h).apply(isWithinBH);
        return distances.approach <= 20
            ? this.#prices.base
            : this.#prices.base + ((distances.approach - 20) * price);
    }

    _calcReturnCosts = (params, routes, isWithinBH) => {
        if(!isWithinBH) {
            const returnDistance = params['back2home'] ? routes.o2h.distanceMeters : routes.d2h.distanceMeters;
            return Number((returnDistance * this.#prices.return.offBH).toFixed(1));
        }

        if(!params.back2home) {
            const distanceRules = [
                { max: 100, apply: (distance) => distance * this.#prices.return.withinBH.low },
                { max: 250, apply: (distance) => distance * this.#prices.return.withinBH.mid },
                { max: Infinity, apply: (distance) => distance * this.#prices.return.withinBH.high }
            ];
            return Number((distanceRules.find(rule => routes.o2d.distanceMeters < rule.max)
                .apply(routes.d2h.distanceMeters)).toFixed(1));
        }

        let returnCosts = routes.o2h.distanceMeters * this.#prices.return.withinBH.low;

        if(params['latency'] >= 180) {
            returnCosts = routes.o2h.distanceMeters <= 30 
                ? 0 
                : (routes.o2h.distanceMeters - 30) * this.#prices.return.withinBH.low;
        }
    
        return Number((returnCosts).toFixed(1));
    }

    
    _calcDiscountLaToVIA = (originDetails, destinationDetails, servDist, pickUp) => {
        const isOriginLA = Utils.checkAddressInLowerAustriaByProvince(originDetails.province ?? null);
        const isDestinationVIA = Utils.checkAddressAtViennaAirport(destinationDetails.zipCode ?? null);
        if(servDist <= 40) {
            const isTimeWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '09:59');
            return isTimeWithinRange && isOriginLA && isDestinationVIA ? this.#prices.discount.la2via : 0;
        }
        if(servDist > 40 && servDist <= 55) {
            const isTimeWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '05:59');
            return isTimeWithinRange && isOriginLA && isDestinationVIA ? this.#prices.discount.la2via : 0;
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
            ? this.#prices.parking.base 
            : 0;

        return charge;
    }
}

module.exports = DrivingDestinationModel;