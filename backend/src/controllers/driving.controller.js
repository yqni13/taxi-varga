const DrivingService = require('../services/driving.repository');
const { checkValidation } = require('../middleware/validation.middleware');

class DrivingController {
    calcDrivingDestination = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingService.calcDestinationRoute(req.body);
        res.send(response);
    }

    calcDrivingFlatrate = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingService.calcFlatrateRoute(req.body);
        res.send(response);
    }

    calcDrivingAirport = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingService.calcAirportRoute(req.body);
        res.send(response);
    }
}

module.exports = new DrivingController;