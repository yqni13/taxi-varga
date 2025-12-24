const { ServiceOption } = require("../../utils/enums/service-option.enum");
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingGolfModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            baseFlat: 4,
            below30Km: 0.65,
            above30Km: 0.5,
            homeBasedRoutePerKm: 0.4,
            stayPerHour: 12,
            servDistBelow20Km: 0.4,
            totalDiscount: 0.25
        }
    }
    calcGolfRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.GOLF);
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2g: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            g2d: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2h: response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
        }
        let result = {
            distance: 0,
            duration: 0,
            stay: 0,
            price: 0
        }

        // Validate relevance & update stay time by removing origin route duration (in total minutes).
        params['stay'] = CustomValidator.validateTravelTimeRelevance(
            Number(params['stay']),
            routes.o2g.duration,
            ServiceOption.GOLF
        );

        // Already converted (google-routes.api.js): distanceMeters to kilometers / duration to minutes.
        const servDist = routes.o2g.distanceMeters + routes.g2d.distanceMeters;
        const servTime = routes.o2g.duration + routes.g2d.duration;

        const approachCosts = this._calcApproachH2O(routes.h2o.distanceMeters);
        const servDistCosts = servDist <= 30 ? servDist * this.#prices.below30Km : servDist * this.#prices.above30Km;
        const servTimeCosts = servDist <= 30 ? servTime * this.#prices.below30Km : servTime * this.#prices.above30Km;
        const returnCosts = routes.d2h.distanceMeters * this.#prices.homeBasedRoutePerKm;
        const stayObj = this._calcStayCosts(Number(params['stay']));

        // Add up all additional charges.
        let additionalCharges = 0;

        let totalCosts = this.#prices.baseFlat + servDistCosts + servTimeCosts + approachCosts + returnCosts + stayObj.costs + additionalCharges;

        // Map additional discounts.
        totalCosts = this._mapDiscountToTotalCosts(totalCosts, params['supportMode']);

        result['distance'] = Math.ceil(servDist);
        result['duration'] = Math.ceil(servTime);
        result['stay'] = stayObj.hours;
        result['price'] = (totalCosts % 1) >= 0.5 ? Math.ceil(totalCosts) : Math.floor(totalCosts);

        return {routeData: result};
    }

    _calcApproachH2O(distance) {
        if(typeof(distance) !== 'number') {
            return 0;
        }
        return distance <= 20 ? 0 : (distance - 20) * this.#prices.homeBasedRoutePerKm;
    }

    _calcStayCosts(time) {
        if(typeof(time) !== 'number') {
            return { hours: 6, costs: 48 };
        }
        // convert min to hour values (min 6h)
        time = time <= 360
            ? 6
            : time % 60 !== 0 
                ? Math.ceil(time / 60) 
                : time / 60;

        return {
            hours: time,
            costs: time > 6 ? (48 + (this.#prices.stayPerHour * (time - 6))) : 48
        };
    }

    _mapDiscountToTotalCosts(costs, support) {
        if(!support) {
            return costs;
        }
        const discount = costs * this.#prices.totalDiscount;
        return discount <= 48 ? costs - discount : costs - 48;
    }
}

module.exports = DrivingGolfModel;