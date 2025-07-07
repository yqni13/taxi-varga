const { ServiceOption } = require("../../utils/enums/service-option.enum");
const Utils = require('../../utils/common.utils');
const { SortingOption } = require("../../utils/enums/sorting-option.enum");

class DrivingQuickModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            basicRateAbove20km: 4,
            basicRateAbove50km: 4,
            basicRateBelow20km: 6,
            servDistAbove20km: 0.6,
            servDistAbove50km: 0.5,
            servDistBelow20km: 0.7,
            returnAbove20km: 0.5,
            returnAbove50km: 0.4,
            returnBelow20km: 0.6,
            occupiedReturnAbove20km: 0.5,
            occupiedReturnAbove50km: 0.4,
            occupiedReturnBelow20km: 0.6,
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
            latency: {},
            returnTarget: ''
        }

        let returnObj = null;
        if(!params.back2origin) {
            returnObj = await this.#googleRoutes.requestBorderRouteMatrix(params);
            returnObj = this._mapShortestReturnLocation(returnObj);
        }

        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.QUICK);
        const routes = {
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2v: !params.back2origin && !returnObj.routeHome ? returnObj : null,
            d2h: !params.back2origin && returnObj.routeHome ? returnObj : null
        }
        const servTime = params['back2origin'] ? routes.o2d.duration + routes.d2o.duration : routes.o2d.duration;
        const latencyObj = this._mapLatencyData(params.back2origin ? params.latency : 0);

        // Sum all additional costs.
        let additionalCosts = 0;
        additionalCosts += latencyObj.costs;

        const totalCosts = this._calcServDistCosts(routes, servTime, returnObj, params.back2origin) + additionalCosts;

        result['price'] = (totalCosts % 1) >= 0.5
            ? Math.ceil(totalCosts)
            : Math.floor(totalCosts);
        result['servTime'] = (servTime % 1) >= 0.5
            ? Math.ceil(servTime)
            : Math.floor(servTime)
        result['latency'] = latencyObj;
        result['returnTarget'] = params.back2origin // abbreviations see glossary
            ? 'or'
            : returnObj.routeHome
                ? 'h'
                : 'vb'

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

    _calcServDistCosts = (routes, servTime, returnObj, back2origin) => {
        let totalCosts = 0;
        const servDist = back2origin
            ? routes.o2d.distanceMeters + routes.d2o.distanceMeters
            : routes.o2d.distanceMeters;

        if(servDist <= 0) {
            return totalCosts;
        }

        if(servDist <= 20) {
            const servCosts = (servDist * this.#prices.servDistBelow20km) + (servTime * this.#prices.servDistBelow20km);
            const basicReturnCosts = back2origin 
                ? routes.d2o.distanceMeters * this.#prices.returnBelow20km
                : returnObj.distance * this.#prices.returnBelow20km;
            const occupiedReturnCosts = back2origin ? routes.d2o.duration * this.#prices.occupiedReturnBelow20km : 0;
            totalCosts = this.#prices.basicRateBelow20km + servCosts + basicReturnCosts + occupiedReturnCosts;
        } else if(servDist > 50) {
            const servCosts = (servDist * this.#prices.servDistAbove50km) + (servTime * this.#prices.servDistAbove50km);
            const basicReturnCosts = back2origin
                ? routes.d2o.distanceMeters * this.#prices.returnAbove50km
                : returnObj.distance * this.#prices.returnAbove50km;
            const occupiedReturnCosts = back2origin ? routes.d2o.duration * this.#prices.occupiedReturnAbove50km : 0;
            totalCosts = this.#prices.basicRateAbove50km + servCosts + basicReturnCosts + occupiedReturnCosts;
        } else {
            const servCosts = (servDist * this.#prices.servDistAbove20km) + (servTime * this.#prices.servDistAbove20km);
            const basicReturnCosts = back2origin
                ? routes.d2o.distanceMeters * this.#prices.returnAbove20km
                : returnObj.distance * this.#prices.returnAbove20km;
            const occupiedReturnCosts = back2origin ? routes.d2o.duration * this.#prices.occupiedReturnAbove20km : 0;
            totalCosts = this.#prices.basicRateAbove20km + servCosts + basicReturnCosts + occupiedReturnCosts;
        }

        return Number(totalCosts.toFixed(1));
    }

    _mapShortestReturnLocation = (data) => {
        data = Utils.quicksort(data, SortingOption.ASC, 'distanceMeters');

        return {
            distance: data[0].distanceMeters,
            duration: data[0].duration,
            routeHome: data[0].originIndex === 0 && data[0].destinationIndex === 0 ? true : false
        };
    }
}

module.exports = DrivingQuickModel;