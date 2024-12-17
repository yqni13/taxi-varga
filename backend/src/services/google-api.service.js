require('dotenv').config();
const axios = require('axios');

class GoogleMapsAPI {
    requestDistanceMatrix = async (params) => {
        const origins = params['origins'];
        const destinations = params['destinations'];
        let result;

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;
        await axios.get(url)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log('google error: ', error.message);
                result = error.message;
        })

        return result;
    }
}

module.exports = new GoogleMapsAPI;