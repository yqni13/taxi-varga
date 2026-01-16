const DrivingService = require('../services/driving.service');
const checkValidation = require('../middleware/validation.middleware');

class DrivingController {
    async calcDrivingAirport(req, res, next) {
        checkValidation(req);
        const response = await DrivingService.calcAirportRoute(req.body);
        res.send(response);
    }

    async calcDrivingDestination(req, res, next) {
        checkValidation(req);
        const response = await DrivingService.calcDestinationRoute(req.body);
        res.send(response);
    }

    async calcDrivingFlatrate(req, res, next) {
        checkValidation(req);
        const response = await DrivingService.calcFlatrateRoute(req.body);
        res.send(response);
    }

    async calcDrivingGolf(req, res, next) {
        checkValidation(req);
        const response = await DrivingService.calcGolfRoute(req.body);
        res.send(response);
    }

    async calcDrivingQuick(req, res, next) {
        checkValidation(req);
        const response = await DrivingService.calcQuickRoute(req.body);
        res.send(response);
    }
}

module.exports = new DrivingController;