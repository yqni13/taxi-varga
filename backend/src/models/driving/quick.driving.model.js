const Utils = require('../../utils/common.utils');
const { ServiceOption } = require("../../utils/enums/service-option.enum");
const { SortingOption } = require("../../utils/enums/sorting-option.enum");
const { QuickRouteOption } = require("../../utils/enums/quickroute-option.enum");

class DrivingQuickModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            base: 4,
            servDist: {
                above8Km: 0.5,
                below8Km: 0.6
            },
            return: {
                above8Km: 0.4,
                below8Km: 0.5
            },
            latency: {
                per30Min: 12
            },
            surcharge: {
                servDist: {
                    mid: 15,
                    high: 30
                },
                time4to6: 0.15,
                time4to10: 6
            }
        }
    }

    async calcQuickRoute(params) {
        params['back2origin'] = params['back2origin'] === 'true' ? true : false;
        params['latency'] = Number(params['latency']);

        const result = {
            price: 0,
            servTime: 0,
            servDist: 0,
            latency: {},
            returnTarget: ''
        }

        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.QUICK);
        const routes = {
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1})
        }
        const servTime = params['back2origin'] ? routes.o2d.duration + routes.d2o.duration : routes.o2d.duration;
        const servDist = params['back2origin'] 
            ? Number((routes.o2d.distanceMeters + routes.d2o.distanceMeters).toFixed(1))
            : Number((routes.o2d.distanceMeters).toFixed(1));

        let returnObj = { distance: 0, duration: 0, routeHome: null};
        const isRouteV2V = this._isRouteWithinVienna(params);
        if(!params.back2origin && !isRouteV2V) {
            const borderRouteData = await this.#googleRoutes.requestBorderRouteMatrix(params);
            returnObj = this._mapShortestReturnLocation(borderRouteData, params['originDetails'], servDist);
        }

        const latencyObj = this._mapLatencyData(params.back2origin ? params.latency : 0);
        const isOriginV = Utils.checkAddressInViennaByProvince(params['originDetails']['province']) || Utils.checkAddressInViennaByZipCode(params['originDetails']['zipCode']) ? true : false;
        const servCostParams = {
            servDist: servDist,
            servTime: servTime,
            returnObj: returnObj,
            isRouteV2V: isRouteV2V,
            back2origin: params.back2origin,
        };

        // Sum all additional costs.
        let additionalCosts = 0;
        additionalCosts += latencyObj.costs;
        additionalCosts += this._calcServDistSurcharge(params.back2origin, servDist);

        let totalCosts = this._calcServDistCosts(servCostParams) + additionalCosts;

        // Surcharge for busy hours.
        totalCosts = this._updateCostsByTimeBasedSurcharge4To6(totalCosts, servTime, params['pickupTIME']);

        totalCosts = isOriginV && !isRouteV2V
            ? this._updateCostsByTimeBasedSurcharge4To10(totalCosts, params['pickupTIME'])
            : totalCosts;

        result['price'] = (totalCosts % 1) >= 0.5
            ? Math.ceil(totalCosts)
            : Math.floor(totalCosts);
        result['servTime'] = (servTime % 1) >= 0.5
            ? Math.ceil(servTime)
            : Math.floor(servTime)
        result['servDist'] = servDist;
        result['latency'] = latencyObj;
        result['returnTarget'] = this._mapReturnTarget(params.back2origin, returnObj.routeHome ?? false, isRouteV2V);

        return { routeData: result };
    }

    _mapLatencyData(latencyInMin) {
        if(!latencyInMin || latencyInMin === 0) {
            return { time: 0, costs: 0 };
        }

        const latencyRoundedTo30 = (Math.ceil(latencyInMin / 30)) * 30;
        const latencyCalcBase = latencyRoundedTo30 < 180 ? latencyRoundedTo30 : 180;

        // First 60min full price (€24/h), 61st-180st min half price (€12/h), for free beyond the 180st min.
        const latencyCosts = latencyCalcBase / 60 > 1
            ? (2 * this.#prices.latency.per30Min) + ((latencyCalcBase - 60) / 30) * (this.#prices.latency.per30Min / 2)
            : (latencyCalcBase / 30) * this.#prices.latency.per30Min;

        return { time: latencyRoundedTo30, costs: latencyCosts };
    }

    _calcServDistSurcharge(back2origin, servDist) {
        const distanceRules = [
            { max: 100, apply: () => 0 },
            { max: 250, apply: () => this.#prices.surcharge.servDist.mid },
            { max: Infinity, apply: () => this.#prices.surcharge.servDist.high }
        ];

        return distanceRules.find(rule => servDist < rule.max).apply();
    }

    _updateCostsByTimeBasedSurcharge4To6(totalCosts, servTime, pickUp) {
        // Costs for route with service time ending before 06:00 are surcharged.
        const servTimeAsString = Utils.getTimeAsStringFromTotalMinutes(servTime);
        const isEndingBeforeLimit =  Utils.checkTimeEndingBeforeLimit(pickUp, servTimeAsString, '06:00')

        return isEndingBeforeLimit 
            ? Number((totalCosts * (1 + this.#prices.surcharge.time4to6)).toFixed(1)) 
            : totalCosts;
    }

    _updateCostsByTimeBasedSurcharge4To10(totalCosts, pickUp) {
        // Costs for route with service time starting within 06:00 - 10:00 are surcharged.
        const isPickupWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '10:00');
        return isPickupWithinRange ? totalCosts + this.#prices.surcharge.time4to10 : totalCosts;
    }

    _calcServDistCosts(servCostParams) {
        let totalCosts = 0;

        if(servCostParams.servDist <= 0) {
            return totalCosts;
        }
        
        // Initiate cost variables.
        let [servCosts, basicReturnCosts] = [0, 0];
        // Initiate price variables
        let [basicRate, servPrice, basicReturnPrice] = [0, 0, 0];

        if(servCostParams.servDist > 8) {
            basicRate = this.#prices.base;
            servPrice = this.#prices.servDist.above8Km;
            basicReturnPrice = this.#prices.return.above8Km;
        } else {
            basicRate = this.#prices.base;
            servPrice = this.#prices.servDist.below8Km;
            basicReturnPrice = this.#prices.return.below8Km;
        }

        servCosts = (servCostParams.servDist * servPrice) + (servCostParams.servTime * servPrice);
        basicReturnCosts = servCostParams.servDist > 2 && !servCostParams.back2origin && !servCostParams.isRouteV2V
            ? servCostParams.returnObj.distance * basicReturnPrice
            : 0;

        totalCosts = basicRate + servCosts + basicReturnCosts;

        return Number(totalCosts.toFixed(1));
    }

    _mapReturnTarget(back2origin, routeHome, isRouteV2V) {
        if(isRouteV2V) {
            return back2origin ? QuickRouteOption.OR : QuickRouteOption.DES;
        } else {
            return back2origin ? QuickRouteOption.OR : routeHome ? QuickRouteOption.HOME : QuickRouteOption.VB;
        }
    }

    _mapShortestReturnLocation(borderRouteData, origin, servDist) {
        let returnData;
        const returnLocation2544 = [borderRouteData.find(obj => {
            return obj.originIndex === 0 && obj.destinationIndex === 0
        })];
        const returnLocationViennaBorder = Utils.quicksort(
            borderRouteData.filter((obj) => obj.destinationIndex !== 0), SortingOption.ASC, 'distanceMeters'
        );

        if(servDist >= 100) {
            returnData = returnLocation2544[0].distanceMeters < returnLocationViennaBorder[0].distanceMeters 
                ? returnLocation2544[0] 
                : returnLocationViennaBorder[0];
        } else if(origin && origin.zipCode === '2544') {
            returnData = returnLocation2544[0];
        } else {
            returnData = returnLocationViennaBorder[0];
        }

        return {
            distance: returnData.distanceMeters,
            duration: returnData.duration,
            routeHome: returnData.originIndex === 0 && returnData.destinationIndex === 0 ? true : false
        };
    }

    _isRouteWithinVienna(params) {
        const isOriginWithinVienna = params.originDetails.zipCode
            ? Utils.checkAddressInViennaByZipCode(params.originDetails.zipCode)
            : Utils.checkAddressInViennaByProvince(params.originDetails.province);

        const isDestinationWithinVienna = params.destinationDetails.zipCode
            ? Utils.checkAddressInViennaByZipCode(params.destinationDetails.zipCode)
            : Utils.checkAddressInViennaByProvince(params.destinationDetails.province);

        return isOriginWithinVienna && isDestinationWithinVienna;
    }
}

module.exports = DrivingQuickModel;