require('dotenv').config();
const axios = require('axios');
const Utilities = require('../utils/common.utils');

class GoogleMapsAPI {
    getRoutesMatrixHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'originIndex,destinationIndex,distanceMeters,duration,status'
        }
    }

    getRoutesSingleHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.routeLabels,routes.routeToken'
        }
    }

    getRoutesMatrixURL() {
        return 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    }

    getRoutesSingleURL() {
        return 'https://routes.googleapis.com/directions/v2:computeRoutes';
    }

    requestDistanceMatrix = async (params) => {
        let origins = params['origin'];
        let destinations = params['destination'];

        origins = origins.replaceAll('+', '%20')
        destinations = destinations.replaceAll('+', '%20')

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
        const origin = params['origin'].replaceAll('+', ' ');
        const destination = params['destination'].replaceAll('+', ' ');

        const headers = this.getRoutesMatrixHeader()
        const url = this.getRoutesMatrixURL();

        const requestData = {
            "origins": [
                {
                    "waypoint": {
                        "address": process.env.HOME_ADDRESS
                    }
                },
                {
                    "waypoint": {
                        "address": origin
                    }
                },
                {
                    "waypoint": {
                        "address": destination
                    }
                }
            ],
            "destinations": [
                {
                    "waypoint": {
                        "address": destination
                    }
                },
                {
                    "waypoint": {
                        "address": origin
                    }
                },
                {
                    "waypoint": {
                        "address": process.env.HOME_ADDRESS
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
                result = error;
            })
        
        result.forEach((entry) => {
            entry['duration'] = Utilities.getTimeInMinutesFromRoutesMatrix(entry.duration);
            entry['distanceMeters'] = Utilities.getDistanceInKmFromRoutesMatrix(entry.distanceMeters);
        });
        return result;
    }

    // // request single route A => B
    // requestEcoFriendlyRoute = async (params) => {
    //     const origins = params['origin'].replaceAll('+', ' ');
    //     const destinations = params['destination'].replaceAll('+', ' ');

    //     const headers = this.getRoutesSingleHeader();
    //     const url = this.getRoutesSingleURL();

    //     const requestData = {
    //         "origin": {
    //             "address": origins
    //         },
    //         "destination": {
    //             "address": destinations
    //         },
    //         "routeModifiers": {
    //             "vehicleInfo": {
    //                 "emissionType": "ELECTRIC"
    //             }
    //         },
    //         "travelMode": "DRIVE",
    //         "routingPreference": "TRAFFIC_AWARE_OPTIMAL",
    //         "requestedReferenceRoutes": ["FUEL_EFFICIENT"]
    //     }

    //     let result;
    //     await axios.post(url, requestData, { headers })
    //         .then(response => {
    //             result = response.data;
    //         })
    //         .catch(error => {
    //             console.log('google request error: ', error.message);
    //             result = error.message;
    //         })

    //     return result;
    // }
}

module.exports = new GoogleMapsAPI;