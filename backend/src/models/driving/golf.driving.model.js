const { ServiceOption } = require("../../utils/enums/service-option.enum");
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingGolfModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            base: 4,
            discount: {
                percent10: 0.1,
                percent15: 0.15,
                percent20: 0.2,
                support: 0.25
            },
            stay: {
                perHour: 12
            },
            service: {
                above30Km: 0.5,
                below30Km: 0.65
            },
            approach: {
                perKm: 0.4
            },
            return: {
                perKm: 0.4
            },
        }
    }
    async calcGolfRoute(params) {
        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.GOLF);
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2g: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            g2d: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
            d2h: response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
        };
        let result = {
            distance: 0,
            duration: 0,
            stay: 0,
            price: 0
        };

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
        const servDistCosts = servDist <= 30
            ? servDist * this.#prices.service.below30Km
            : servDist * this.#prices.service.above30Km;
        const servTimeCosts = servDist <= 30
            ? servTime * this.#prices.service.below30Km
            : servTime * this.#prices.service.above30Km;
        const returnCosts = routes.d2h.distanceMeters * this.#prices.return.perKm;
        const stayObj = this._calcStayCosts(Number(params['stay']));

        // Add up all additional charges.
        let additionalCharges = 0;

        let totalCosts = this.#prices.base + servDistCosts + servTimeCosts + approachCosts + returnCosts + stayObj.costs + additionalCharges;

        // Map additional discounts.
        totalCosts = this._mapSupportDiscount(totalCosts, params['supportMode']);
        totalCosts = this._mapLongDistanceDiscount(totalCosts, servDist);

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
        return distance <= 20 ? 0 : (distance - 20) * this.#prices.approach.perKm;
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
            costs: time > 6 ? (48 + (this.#prices.stay.perHour * (time - 6))) : 48
        };
    }

    _mapSupportDiscount(costs, support) {
        if(!support) {
            return costs;
        }
        const discount = costs * this.#prices.discount.support;
        return discount <= 48 ? costs - discount : costs - 48;
    }

    _mapLongDistanceDiscount(costs, servDist) {
        const distanceRules = [
            { max: 200, apply: (cost) => cost },
            { max: 300, apply: (cost) => cost * (1 - this.#prices.discount.percent10) },
            { max: 400, apply: (cost) => cost * (1 - this.#prices.discount.percent15) },
            { max: Infinity, apply: (cost) => cost * (1 - this.#prices.discount.percent20) }
        ];

        return distanceRules.find(rule => servDist < rule.max).apply(costs);
    }
}

module.exports = DrivingGolfModel;