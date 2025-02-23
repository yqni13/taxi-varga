require('dotenv').config();
const axios = require('axios');
const Utilities = require('../../utils/common.utils');
const Secrets = require('../../utils/secrets.utils');

class GoogleRoutesAPI {
    getRoutesHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'originIndex,destinationIndex,distanceMeters,duration,status'
        }
    }

    getRoutesURL() {
        return 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    }

    requestMapsMatrix = async (params, useId) => {
        const prefix = 'place_id:';
        let origins, destinations;
        if(useId === 'origin') {
            origins = `${prefix}${params['origin']}`;
            destinations = String(params['destination']).replaceAll('+', '%20');
        } else if(useId === 'destination') {
            origins = String(params['origin']).replaceAll('+', '%20');
            destinations = `${prefix}${params['destination']}`;
        }

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_API_KEY}`;

        let result;
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

    // request service route matrix (home => ) origin => destination => origin ( => home)
    requestRouteMatrix = async (params) => {
        const origin = params['originDetails']['placeId'];
        const destination = params['destinationDetails']['placeId'];

        const headers = this.getRoutesHeader()
        const url = this.getRoutesURL();

        const requestData = {
            "origins": [
                {
                    "waypoint": {
                        "address": Secrets.HOME_ADDRESS
                    }
                },
                {
                    "waypoint": {
                        "placeId": origin
                    }
                },
                {
                    "waypoint": {
                        "placeId": destination
                    }
                }
            ],
            "destinations": [
                {
                    "waypoint": {
                        "placeId": destination
                    }
                },
                {
                    "waypoint": {
                        "placeId": origin
                    }
                },
                {
                    "waypoint": {
                        "address": Secrets.HOME_ADDRESS
                    }
                }
            ],
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
        }

        let result;
        await axios.post(url, requestData, { headers })
            .then(response => {
                result = response.data; // response[entry] = {distanceMeters: number, duration: number}
            })
            .catch(error => {
                console.log('google request error: ', error.message);
                return error;
            })
        
        result.forEach((entry) => {
            entry['duration'] = Utilities.getTimeInMinutesFromRoutesMatrix(entry.duration);
            entry['distanceMeters'] = Utilities.getDistanceInKmFromRoutesMatrix(entry.distanceMeters);
        });
        return result;
    }
}

module.exports = new GoogleRoutesAPI;