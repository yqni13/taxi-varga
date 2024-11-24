const DrivingRepository = require('../repositories/driving.repository');
const { checkValidation } = require('../middleware/validation.middleware');

class DrivingController {
    calcDrivingDestination = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingRepository.calcDestinationRoute(req.body);
        res.send(response);
    }

    calcDrivingFlatrate = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingRepository.calcFlatrateRoute(req.body);
        res.send(response);
    }

    calcDrivingAirport = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingRepository.calcAirportRoute(req.body);
        res.send(response);
    }
}

module.exports = new DrivingController;