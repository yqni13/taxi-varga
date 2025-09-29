const { ServiceOption } = require("../../utils/enums/service-option.enum");
const Utils = require('../../utils/common.utils');
const { SortingOption } = require("../../utils/enums/sorting-option.enum");
const { QuickRouteOption } = require("../../utils/enums/quickroute-option.enum");

class DrivingQuickModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            basicRate: 4,
            servDistBelow8km: 0.6,
            servDistAbove8km: 0.5,
            returnBelow8km: 0.5,
            returnAbove8km: 0.4,
            latencyBy5Min: 0.5,
            morningSurcharge: 1.15,
            surcharge4to10: 6
        }
    }

    calcQuickRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        params['back2origin'] = params['back2origin'] === 'true' ? true : false;
        params['latency'] = Number(params['latency']);

        const result = {
            price: 0,
            servTime: 0,
            servDist: 0,
            latency: {},
            returnTarget: ''
        }

        let returnObj = { distance: 0, duration: 0, routeHome: null};
        const isRouteV2V = this._isRouteWithinVienna(params);
        if(!params.back2origin && !isRouteV2V) {
            returnObj = await this.#googleRoutes.requestBorderRouteMatrix(params);
            returnObj = this._mapShortestReturnLocation(returnObj, params['originDetails']);
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

    _mapLatencyData = (latencyInMin) => {
        // First 5 minutes of latency are for free.
        if(!latencyInMin || latencyInMin <= 5) {
            return { time: 0, costs: 0 };
        }
        const latencyRoundedUp = latencyInMin % 5 === 0 ? latencyInMin : (Math.ceil(latencyInMin / 5) * 5);
        const latencyCosts = (latencyRoundedUp - 5) * this.#prices.latencyBy5Min;

        return { time: latencyRoundedUp, costs: latencyCosts };
    }

    _updateCostsByTimeBasedSurcharge4To6 = (totalCosts, servTime, pickUp) => {
        // Costs for route with service time ending before 06:00 are surcharged.
        const servTimeAsString = Utils.getTimeAsStringFromTotalMinutes(servTime);
        const isEndingBeforeLimit =  Utils.checkTimeEndingBeforeLimit(pickUp, servTimeAsString, '06:00')

        return isEndingBeforeLimit ? Number((totalCosts * this.#prices.morningSurcharge).toFixed(1)) : totalCosts;
    }

    _updateCostsByTimeBasedSurcharge4To10 = (totalCosts, pickUp) => {
        // Costs for route with service time starting within 06:00 - 10:00 are surcharged.
        const isPickupWithinRange = Utils.isTimeStartingWithinRange(pickUp, '04:00', '10:00');
        return isPickupWithinRange ? totalCosts + this.#prices.surcharge4to10 : totalCosts;
    }

    _calcServDistCosts = (servCostParams) => {
        let totalCosts = 0;

        if(servCostParams.servDist <= 0) {
            return totalCosts;
        }
        
        // Initiate cost variables.
        let [servCosts, basicReturnCosts] = [0, 0];
        // Initiate price variables
        let [basicRate, servPrice, basicReturnPrice] = [0, 0, 0];

        if(servCostParams.servDist > 8) {
            basicRate = this.#prices.basicRate;
            servPrice = this.#prices.servDistAbove8km;
            basicReturnPrice = this.#prices.returnAbove8km;
        } else {
            basicRate = this.#prices.basicRate;
            servPrice = this.#prices.servDistBelow8km;
            basicReturnPrice = this.#prices.returnBelow8km;
        }

        servCosts = (servCostParams.servDist * servPrice) + (servCostParams.servTime * servPrice);
        basicReturnCosts = servCostParams.servDist > 2 && !servCostParams.back2origin && !servCostParams.isRouteV2V
            ? servCostParams.returnObj.distance * basicReturnPrice
            : 0;

        totalCosts = basicRate + servCosts + basicReturnCosts;

        return Number(totalCosts.toFixed(1));
    }

    _mapReturnTarget = (back2origin, routeHome, isRouteV2V) => {
        if(isRouteV2V) {
            return back2origin ? QuickRouteOption.OR : QuickRouteOption.DES;
        } else {
            return back2origin ? QuickRouteOption.OR : routeHome ? QuickRouteOption.HOME : QuickRouteOption.VB;
        }
    }

    _mapShortestReturnLocation = (data, origin) => {
        if(origin && origin.zipCode === '2544') {
            data = [data.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 0})];
        } else {
            // If origin !== 2544 => return MUST be to Vienna border waypoint (remove oIndex = 0 & dIndex = 0).
            const filteredData = data.filter((obj) => obj.destinationIndex !== 0);
            data = Utils.quicksort(filteredData, SortingOption.ASC, 'distanceMeters');
        }

        return {
            distance: data[0].distanceMeters,
            duration: data[0].duration,
            routeHome: data[0].originIndex === 0 && data[0].destinationIndex === 0 ? true : false
        };
    }

    _isRouteWithinVienna = (params) => {
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