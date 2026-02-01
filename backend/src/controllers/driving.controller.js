const DrivingService = require('../services/driving.service');
const checkValidation = require('../middleware/validation.middleware');

class DrivingController {
    async calcDrivingAirport(req, res, next) {
        try {
            checkValidation(req);
            const response = await DrivingService.calcAirportRoute(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async calcDrivingDestination(req, res, next) {
        try {
            checkValidation(req);
            const response = await DrivingService.calcDestinationRoute(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async calcDrivingFlatrate(req, res, next) {
        try {
            checkValidation(req);
            const response = await DrivingService.calcFlatrateRoute(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async calcDrivingGolf(req, res, next) {
        try {
            checkValidation(req);
            const response = await DrivingService.calcGolfRoute(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async calcDrivingQuick(req, res, next) {
        try {
            checkValidation(req);
            const response = await DrivingService.calcQuickRoute(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new DrivingController;