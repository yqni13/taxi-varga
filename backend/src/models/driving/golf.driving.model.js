const { ServiceOption } = require("../../utils/enums/service-option.enum");
const { SupportModeOption } = require("../../utils/enums/supportmode-option.enum");
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingGolfModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            below30Km: 0.65,
            above30Km: 0.5,
            homeBasedRoutePerKm: 0.4,
            stayPerHour: 12,
            servDistBelow20Km: 0.4
        }
    }
    calcGolfRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.GOLF);
        // h2o: home to golfcourse
        // o2g: origin to golfcourse
        // g2d: golfcourse to destination
        // d2h: destination to home
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
        let additionalCharges = 0;

        // validate relevance & update stay time by removing origin route duration (in total minutes)
        params['stay'] = CustomValidator.validateTravelTimeRelevance(
            Number(params['stay']),
            routes.o2g.duration,
            ServiceOption.GOLF
        );

        // already converted (google-routes.api.js): distanceMeters to kilometers / duration to minutes
        const serveWay = routes.o2g.distanceMeters + routes.g2d.distanceMeters;
        const serveTime = routes.o2g.duration + routes.g2d.duration;

        const serveWayCosts = serveWay <= 30 ? serveWay * this.#prices.below30Km : serveWay * this.#prices.above30Km;
        const serveTimeCosts = serveWay <= 30 ? serveTime * this.#prices.below30Km : serveTime * this.#prices.above30Km;
        const approachCosts = this._calcHomeBasedRouteCosts(routes.h2o.distanceMeters);
        const returnCosts = this._calcHomeBasedRouteCosts(routes.d2h.distanceMeters);
        const stayObj = this._calcStayCosts(Number(params['stay']));
        const supportCosts = params['supportMode'] !== SupportModeOption.NONE ? 36 : 0;

        // Add up all additional charges
        additionalCharges += this._addChargeServiceDistanceBelow20Km(routes);

        const totalCosts = serveWayCosts + serveTimeCosts + approachCosts + returnCosts + stayObj.costs + supportCosts + additionalCharges;

        result['distance'] = Math.ceil(serveWay);
        result['duration'] = Math.ceil(serveTime);
        result['stay'] = stayObj.hours;
        result['price'] = (totalCosts % 1) >= 0.5 ? Math.ceil(totalCosts) : Math.floor(totalCosts);

        return {routeData: result};
    }

    _calcHomeBasedRouteCosts = (distance) => {
        if(typeof(distance) !== 'number') {
            return 0;
        }
        return distance <= 30 ? 0 : (distance - 30) * this.#prices.homeBasedRoutePerKm;
    }

    _calcStayCosts = (time) => {
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

    _addChargeServiceDistanceBelow20Km = (routes) => {
        let charge = 0;
        const serviceDistance = routes.o2g.distanceMeters + routes.g2d.distanceMeters;
        if(serviceDistance > 20) {
            return charge;
        }

        // Additional charge on approach
        charge += routes.h2o.distanceMeters * this.#prices.servDistBelow20Km;
        // Additional charge on return home
        charge += routes.d2h.distanceMeters * this.#prices.servDistBelow20Km;

        return Number((charge).toFixed(1));
    }
}

module.exports = DrivingGolfModel;