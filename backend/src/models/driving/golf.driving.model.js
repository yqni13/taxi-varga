const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const { ServiceOption } = require("../../utils/enums/service-option.enum");
const { SupportModeOption } = require("../../utils/enums/supportmode-option.enum");

class DrivingGolfModel {
    calcGolfRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        let result = {
            distance: 0,
            duration: 0,
            stay: 0,
            price: 0
        }
        const priceLess30km = 0.65;
        const priceMore30km = 0.5;

        // GET ROUTE DATA
        const response = await GoogleRoutes.requestRouteMatrix(params, ServiceOption.GOLF);
        const home2origin = response.find(obj => { 
            return obj.originIndex === 0 && obj.destinationIndex === 1;
        });
        const origin2golfcourse = response.find(obj => { 
            return obj.originIndex === 1 && obj.destinationIndex === 0;
        });
        const golfcourse2destination = response.find(obj => {
            return obj.originIndex === 2 && obj.destinationIndex === 1;
        });
        const destination2home = response.find(obj => {
            return obj.originIndex === 3 && obj.destinationIndex === 2;
        });

        // already converted (google-routes.api.js): distanceMeters to kilometers / duration to minutes
        const serveWay = origin2golfcourse.distanceMeters + golfcourse2destination.distanceMeters;
        const serveTime = origin2golfcourse.duration + golfcourse2destination.duration;

        const serveWayCosts = serveWay <= 30 ? serveWay * priceLess30km : serveWay * priceMore30km;
        const serveTimeCosts = serveWay <= 30 ? serveTime * priceLess30km : serveTime * priceMore30km;
        const approachCosts = this.calculateHomeBasedRouteCosts(home2origin.distanceMeters);
        const returnCosts = this.calculateHomeBasedRouteCosts(destination2home.distanceMeters);
        const stayObj = this.calculateStayCosts(Number(params['stay']));
        const supportCosts = params['supportMode'] !== SupportModeOption.NONE ? 36 : 0;
        const totalCosts = serveWayCosts + serveTimeCosts + approachCosts + returnCosts + stayObj.costs + supportCosts;

        result['distance'] = Math.ceil(serveWay);
        result['duration'] = Math.ceil(serveTime);
        result['stay'] = stayObj.hours;
        result['price'] = (totalCosts % 1) >= 5 ? Math.ceil(totalCosts) : Math.floor(totalCosts);

        return {routeData: result};
    }

    calculateHomeBasedRouteCosts = (distance) => {
        const pricePerKm = 0.4;
        return distance <= 30 ? 0 : (distance - 30) * pricePerKm;
    }

    calculateStayCosts = (time) => {
        const priceStay1h = 12;

        // convert min to hour values
        time = time <= 360
            ? 6
            : time % 60 !== 0 
                ? Math.ceil(time / 60) 
                : time / 60;

        return {
            hours: time,
            costs: time > 6 ? (48 + (priceStay1h * (time - 6))) : 48
        };
    }
}

module.exports = new DrivingGolfModel;