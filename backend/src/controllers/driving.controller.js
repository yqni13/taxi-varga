const DrivingService = require('../services/driving.service');
const { checkValidation } = require('../middleware/validation.middleware');

class DrivingController {
    calcDrivingAirport = async (req, res, next) => {
        checkValidation(req);
        const response = await DrivingService.calcAirportRoute(req.body);
        res.send(response);
    }

    calcDrivingDestination = async (req, res, next) => {
        checkValidation(req);
        const response = await DrivingService.calcDestinationRoute(req.body);
        res.send(response);
    }

    calcDrivingFlatrate = (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = DrivingService.calcFlatrateRoute(req.body);
        res.send(response);
    }
}

module.exports = new DrivingController;