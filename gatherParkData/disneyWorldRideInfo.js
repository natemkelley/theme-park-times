var colors = require('colors');
var moment = require("moment");
var request = require("request");
var disneyRideController = require('../gatherParkData/controllers/disneyParkRideInfoController.js')

module.exports = function (parksArrayForAttractions) {
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
                })
            }
        })
    })


    function getRideData(ride, park) {
        var url = "https://touringplans.com/" + park + "/attractions/" + ride.permalink + ".json"
        var options = {
            url: url,
            json: true
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                disneyRideController.saveRideInformation(body)
            }

            if (error) {
                console.log(error.red);
            }
        })
    }


}
