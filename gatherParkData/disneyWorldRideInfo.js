var colors = require('colors');
var moment = require("moment");
var request = require("request");
var disneyRideController = require('../gatherParkData/controllers/disneyParkRideInfoController.js')

module.exports = function (parksArrayForAttractions) {

    setTimeout(function () {
        getRideInfo();
    }, 10);

    function getRideInfo() {
        parksArrayForAttractions.forEach(function (park) {
            var url = "http://touringplans.com/" + park + "/attractions.json";
            var options = {
                url: url,
                json: true
            }
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    body.forEach(function (ride) {
                        getRideData(ride, park)
                            .then(rideJSON => {
                                return rideJSON
                            })
                            .then(rideJSON => {
                                return new Promise((resolve, reject) => {
                                    getRideTimeID(rideJSON, park)
                                })

                            })
                    })
                }
            })
        })
    }

    //disneyRideController.saveRideInformation(rideJSON)


    function getRideData(ride, park) {
        return new Promise((resolve, reject) => {
            var url = "https://touringplans.com/" + park + "/attractions/" + ride.permalink + ".json"
            var options = {
                url: url,
                json: true
            }
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    resolve(body)
                }

                if (error) {
                    console.log(error.red);
                }
            })
        })
    }

    function getRideTimeID(rideJSON, park) {
        //console.log(ride);
        var returnPark = null;

        switch (park) {
            case 'magic-kindgom':
                returnPark = 'Magic Kingdom - Walt Disney World Florida';
                break;
            case 'disney-california-adventure':
                returnPark = 'California Adventure - Disneyland Resort';
                break;
            case 'epcot':
                returnPark = 'Epcot - Walt Disney World Florida';
                break;
            case 'animal-kingdom':
                returnPark = 'Animal Kingdom - Walt Disney World Florida';
                break;
            case 'hollywood-studios':
                returnPark = 'Hollywood Studios - Walt Disney World Florida';
                break;
            default:
                returnPark = 'Magic Kingdom - Disneyland Resort';
        }


        disneyRideController.getRideIDByPark(rideJSON.name, returnPark);

    }
}

//
