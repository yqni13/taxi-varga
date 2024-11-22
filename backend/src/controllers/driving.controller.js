const DrivingRepository = require('../repositories/driving.repository');
const { checkValidation } = require('../middleware/validation.middleware');

class DrivingController {
    getCalculation = async (req, res, next) => {
        checkValidation(req);
        console.log(req.body); // result == {}
        const response = await DrivingRepository.calcRoute(req.body);
        res.send(response);
    }
}

module.exports = new DrivingController;