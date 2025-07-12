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
            basicRateAbove8km: 4,
            basicRateAbove20km: 4,
            basicRateBelow8km: 6,
            servDistAbove8km: 0.6,
            servDistAbove20km: 0.5,
            servDistBelow8km: 0.7,
            returnAbove8km: 0.5,
            returnAbove20km: 0.4,
            returnBelow8km: 0.6,
            occupiedReturnAbove8km: 0.5,
            occupiedReturnAbove20km: 0.4,
            occupiedReturnBelow8km: 0.6,
            latencyBy5Min: 0.5
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

        let returnObj = {};
        if(!params.back2origin) {
            returnObj = await this.#googleRoutes.requestBorderRouteMatrix(params);
            returnObj = this._mapShortestReturnLocation(returnObj);
        }

        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.QUICK);
        const routes = {
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1})
        }
        const servTime = params['back2origin'] ? routes.o2d.duration + routes.d2o.duration : routes.o2d.duration;
        const servDist = params['back2origin'] 
            ? routes.o2d.distanceMeters + routes.d2o.distanceMeters 
            : routes.o2d.distanceMeters;
        const latencyObj = this._mapLatencyData(params.back2origin ? params.latency : 0);
        const isRouteV2V = this._isRouteWithinVienna(params);
        const servCostParams = {
            servDist: servDist,
            servTime: servTime,
            returnObj: returnObj,
            back2origin: params.back2origin,
            isRouteV2V: isRouteV2V
        };

        // Sum all additional costs.
        let additionalCosts = 0;
        additionalCosts += latencyObj.costs;

        let totalCosts = this._calcServDistCosts(routes, servCostParams) + additionalCosts;

        // Surcharge for busy hours.
        totalCosts = params['pickupTIME'] <= 6 ? (totalCosts * 1.15) : totalCosts;

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
        const latencyCosts = latencyRoundedUp * this.#prices.latencyBy5Min;

        return { time: latencyRoundedUp, costs: latencyCosts };
    }

    _calcServDistCosts = (routes, servCostParams) => {
        let totalCosts = 0;

        if(servCostParams.servDist <= 0) {
            return totalCosts;
        }
        
        // Initiate cost variables.
        let [servCosts, basicReturnCosts, occupiedReturnCosts] = [0, 0, 0];
        // Initiate price variables
        let [basicRate, servPrice, basicReturnPrice, occupiedReturnPrice] = [0, 0, 0, 0];

        if(servCostParams.servDist <= 8) {
            basicRate = this.#prices.basicRateBelow8km;
            servPrice = this.#prices.servDistBelow8km;
            basicReturnPrice = this.#prices.returnBelow8km;
            occupiedReturnPrice = this.#prices.occupiedReturnBelow8km;
        } else if(servCostParams.servDist > 20) {
            basicRate = this.#prices.basicRateAbove20km;
            servPrice = this.#prices.servDistAbove20km;
            basicReturnPrice = this.#prices.returnAbove20km;
            occupiedReturnPrice = this.#prices.occupiedReturnAbove20km;
        } else {
            basicRate = this.#prices.basicRateAbove8km;
            servPrice = this.#prices.servDistAbove8km;
            basicReturnPrice = this.#prices.returnAbove8km;
            occupiedReturnPrice = this.#prices.occupiedReturnAbove8km;
        }

        servCosts = (servCostParams.servDist * servPrice) + (servCostParams.servTime * servPrice);
        if(!servCostParams.isRouteV2V) {
            basicReturnCosts = servCostParams.back2origin
                ? routes.d2o.distanceMeters * basicReturnPrice
                : servCostParams.returnObj.distance * basicReturnPrice;
            occupiedReturnCosts = servCostParams.back2origin
                ? routes.d2o.duration * occupiedReturnPrice
                : 0;
        }
        totalCosts = basicRate + servCosts + basicReturnCosts + occupiedReturnCosts;

        return Number(totalCosts.toFixed(1));
    }

    _mapReturnTarget = (back2origin, routeHome, isRouteV2V) => {
        if(isRouteV2V) {
            return back2origin ? QuickRouteOption.OR : QuickRouteOption.DES;
        } else {
            return back2origin ? QuickRouteOption.OR : routeHome ? QuickRouteOption.HOME : QuickRouteOption.VB;
        }
    }

    _mapShortestReturnLocation = (data) => {
        data = Utils.quicksort(data, SortingOption.ASC, 'distanceMeters');

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