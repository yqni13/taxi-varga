require('dotenv').config();
const axios = require('axios');
const {RoutesClient} = require('@googlemaps/routing').v2;
const routingClient = new RoutesClient();

class GoogleMapsAPI {
    requestDistanceMatrix = async (params) => {
        let origins = '';
        // if(params['origins'].length > 1) {
        //     params['origins'].forEach((address) => {
        //         origins += `${address}%7C`;
        //     })
        //     origins = origins.slice(0, -3);
        // } else {
        // }
        origins = params['origin'];

        let destinations = '';
        // if(params['destinations'].length > 1) {
        //     params['destinations'].forEach((address) => {
        //         destinations += `${address}%7C`;
        //     })
        //     destinations = destinations.slice(0, -3);
        // } else {
        // }
        destinations = params['destination'];

        origins = origins.replaceAll('+', '%20')
        destinations = destinations.replaceAll('+', '%20')
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

    // requestRoutesMatrix = async (params) => {
    //     // const routingClient = new RoutesClient();
    //     console.log('enter requestRoutesMatrix()');
    //     let origins = [];
    //     params['origins'].forEach((entry) => {
    //         origins.push({
    //             address: entry
    //         })
    //     });
        
    //     let destinations = [];
    //     params['destinations'].forEach((entry) => {
    //         destinations.push({
    //             address: entry
    //         })
    //     });
        
    //     let result;
    //     const request = {
    //         origins,
    //         destinations
    //     };

    //     axios({
    //         method: 'post',
    //         url: 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix/',
    //         headers: {
    //             "Content-Type": "application/json",
    //             "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
    //             "X-Goog-FieldMask": "originIndex,destinationIndex,status,distanceMeters,duration",
    //         },
    //         data: request
    //     }).then(response => {
    //         result = response.data;
    //     }).catch(error => {
    //         console.log('google error: ', error);
    //         result = error.message;
    //     });

    //     // const stream = await routingClient.computeRouteMatrix(request, {
    //     //     otherArgs: {
    //     //         headers: {
    //     //             "Content-Type": "application/json",
    //     //             "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
    //     //             "X-Goog-FieldMask": "originIndex,destinationIndex,status,distanceMeters,duration",
    //     //         },
    //     //     },
    //     // });
    //     // stream.on("data", (response) => {
    //     //     result = response;
    //     //     console.log("route matrix response: ", response);
    //     // });
    //     // stream.on("error", (err) => {
    //     //     console.log("route matrix response: ", err);
    //     //     result = err
    //     // });
    //     // stream.on("end", () => {
    //     //     // finished
    //     // })

    //     return result;
    // }
}

module.exports = new GoogleMapsAPI;