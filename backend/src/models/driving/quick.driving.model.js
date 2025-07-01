const { ServiceOption } = require("../../utils/enums/service-option.enum");

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
            emptyReturnAbove20km: 0.5,
            emptyReturnAbove50km: 0.4,
            emptyReturnBelow20km: 0.6,
            occupiedReturnAbove20km: 0.5,
            occupiedReturnAbove50km: 0.4,
            occupiedReturnBelow20km: 0.6
        }
    }

    calcQuickRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        params['back2home'] = params['back2home'] === 'true' ? true : false;

        const result = {
            price: 0
        }

        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.QUICK);
// TODO(yqni13): how to calc destination to nearest city border?
        const routes = {
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2o: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2c: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 0}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
        }

        const servDist = params['back2home']
            ? routes.o2d.distanceMeters + routes.d2o.distanceMeters
            : routes.o2d.distanceMeters;

        const servTime = params['back2home']
            ? routes.o2d.duration + routes.d2o.duration
            : routes.o2d.duration;

        const returnObj = this._mapShortestReturnLocation(routes);

        const totalCosts = this._calcCostsByServiceDistance(servDist, servTime, returnObj, params['back2home']);

        result['price'] = (totalCosts % 1) >= 0.5
            ? Math.ceil(totalCosts)
            : Math.floor(totalCosts);

        return { routeData: result };
    }

    _calcCostsByServiceDistance = (servDist, servTime, returnObj, back2home) => {
        let totalCosts = 0;
        if(servDist <= 0) {
            return totalCosts;
        }

        if(servDist <= 20) {
            const servCosts = (servDist * this.#prices.servDistBelow20km) + (servTime * this.#prices.servDistBelow20km);
            const basicReturnCosts = returnObj.distance * this.#prices.emptyReturnBelow20km;
            const occupiedReturnCosts = back2home ? returnObj.duration * this.#prices.emptyReturnBelow20km : 0;
            totalCosts = this.#prices.basicRateBelow20km + servCosts + basicReturnCosts + occupiedReturnCosts;
        } else if(servDist > 50) {
            const servCosts = (servDist * this.#prices.servDistAbove50km) + (servTime * this.#prices.servDistAbove50km);
            const basicReturnCosts = returnObj.distance * this.#prices.emptyReturnAbove50km;
            const occupiedReturnCosts = back2home ? returnObj.duration * this.#prices.emptyReturnAbove50km : 0;
            totalCosts = this.#prices.basicRateAbove50km + servCosts + basicReturnCosts + occupiedReturnCosts;
        } else {
            const servCosts = (servDist * this.#prices.servDistAbove20km) + (servTime * this.#prices.servDistAbove20km);
            const basicReturnCosts = returnObj.distance * this.#prices.emptyReturnAbove20km;
            const occupiedReturnCosts = back2home ? returnObj.duration * this.#prices.emptyReturnAbove20km : 0;
            totalCosts = this.#prices.basicRateAbove20km + servCosts + basicReturnCosts + occupiedReturnCosts;
        }

        return Number(totalCosts.toFixed(1));
    }

    _mapShortestReturnLocation = (routes) => {
        const shortestReturnLocation = routes.d2c.distanceMeters <= routes.d2h.distanceMeters
            ? routes.d2c
            : routes.d2h;

        return {
            distance: shortestReturnLocation.distanceMeters,
            duration: shortestReturnLocation.duration
        };
    }
}

module.exports = DrivingQuickModel;