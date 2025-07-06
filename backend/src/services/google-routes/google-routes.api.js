require('dotenv').config();
const axios = require('axios');
const Utilities = require('../../utils/common.utils');
const Secrets = require('../../utils/secrets.utils');
const { ServiceOption } = require('../../utils/enums/service-option.enum');
const GeoLocation_ViennaBorder_data = require('./vienna-border.locations.json');

class GoogleRoutesAPI {
    #env_GOOGLE_API_KEY;
    #env_HOME_ADDRESS;

    constructor() {
        this.#env_GOOGLE_API_KEY = Secrets.GOOGLE_API_KEY;
        this.#env_HOME_ADDRESS = Secrets.HOME_ADDRESS;
    }

    getRoutesHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': Secrets.GOOGLE_API_KEY,
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

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${this.#env_GOOGLE_API_KEY}`;

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
    requestRouteMatrix = async (params, service) => {
        const origin = params['originDetails']['placeId'];
        const destination = params['destinationDetails']['placeId'];
        const golfcourse = service === ServiceOption.GOLF ? params['golfcourseDetails']['placeId'] : '';

        const headers = this.getRoutesHeader()
        const url = this.getRoutesURL();

        const requestData = {
            "origins": [
                {
                    "waypoint": {
                        "address": this.#env_HOME_ADDRESS
                    }
                },
                {
                    "waypoint": {
                        "placeId": origin
                    }
                },
                {
                    "waypoint": {
                        "placeId": service === ServiceOption.GOLF ? golfcourse : destination
                    }
                },
                {
                    "waypoint": {
                        "placeId": destination // only for ServiceOption.GOLF
                    }
                }
            ],
            "destinations": [
                {
                    "waypoint": {
                        "placeId": service === ServiceOption.GOLF ? golfcourse : destination
                    }
                },
                {
                    "waypoint": {
                        "placeId": service === ServiceOption.GOLF ? destination : origin
                    }
                },
                {
                    "waypoint": {
                        "address": this.#env_HOME_ADDRESS
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

    requestRouteMatrix_ClosestViennaBorder = async (params) => {
        const borders = structuredClone(GeoLocation_ViennaBorder_data['borders']);
        const headers = this.getRoutesHeader()
        const url = this.getRoutesURL();

        const destination = params['destinationDetails']['placeId'];
        const payload = {
            "origins": [
                {
                    "waypoint": {
                        "placeId": destination
                    }
                }
            ],
            "destinations": [
                {
                    "waypoint": {
                        "address": this.#env_HOME_ADDRESS
                    }
                }
            ],
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE_OPTIMAL"
        }

        Object.values(borders).forEach((border) => {
            payload.destinations.push({ "waypoint": border });
        })

        let result;
        await axios.post(url, payload, { headers })
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