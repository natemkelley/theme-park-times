var colors = require('colors');
var moment = require("moment");
var disneyParkController = require('../gatherParkData/controllers/disneyParkTimesController.js')
var TWOMINUTES = 1000 * 60 * 2;

module.exports = function (parksArray) {
    setInterval(function () {
        loopForWaitTimes(parksArray)
    }, TWOMINUTES);

    //start the first function
    loopForWaitTimes(parksArray);
}

function loopForWaitTimes(parksArray) {
    console.log(colors.yellow('starting the parks loop'));
    var increment = 100;

    parksArray.forEach(function (parkObject) {
        getParkTimes(parkObject)
            .then((parkTimesObject) => {
                if ((parkTimesObject.currentTime > parkTimesObject.openingTime) && (parkTimesObject.currentTime < parkTimesObject.closingTime)) {
                    return true
                }
            })
            .then(isParkOpen => {
                if (isParkOpen) {
                    getWaitTimesparkObject(parkObject).then((parkRidesArray) => {
                        parkRidesArray.forEach(function (ride) {
                            increment += 50;
                            setTimeout(function () {
                                disneyParkController.saveRideTime(ride);
                            }, increment);
                        })
                    });
                }
            })
    });
}

function getParkTimes(parkObject) {
    var returnJSON = {};
    return new Promise((resolve, reject) => {
        parkObject.GetOpeningTimes().then(function (openingTimes) {
            var time = parkObject.TimeNow();
            var timezone = parkObject.Timezone;
            var date = parkObject.DateNow();

            var currentTime = moment(time).tz(timezone).format();
            var openingTime = openingTimes[0].openingTime;
            var closingTime = openingTimes[0].closingTime;

            returnJSON.date = date;
            returnJSON.currentTime = currentTime;
            returnJSON.openingTime = openingTime;
            returnJSON.closingTime = closingTime;

            resolve(returnJSON)
        });
    })
}

function getWaitTimesparkObject(parkObject) {
    var returnArray = [];

    return new Promise((resolve, reject) => {
        parkObject.GetWaitTimes().then(function (rides) {
            for (var i = 0, ride; ride = rides[i++];) {
                var rideObject = {};

                if ((ride.schedule != undefined) || ride.status == "Operating") {
                    rideObject.name = ride.name;
                    rideObject.waitTime = ride.waitTime;
                    rideObject.lastUpdate = moment(ride.lastUpdate).format();
                    rideObject.status = ride.status;
                    rideObject.active = ride.active;
                    rideObject.parkName = parkObject.Name;
                    rideObject.id = ride.id;
                    rideObject.date = moment(parkObject.DateNow()).tz(parkObject.Timezone).format();

                    if (ride.schedule != undefined) {
                        rideObject.schedule = ride.schedule;
                        rideObject.schedule.date = moment(rideObject.schedule.date).tz(parkObject.Timezone).format()
                    } else {
                        rideObject.schedule = null
                    }

                    returnArray.push(rideObject)
                }
            }

            resolve(returnArray);
        }, console.error);

    })

}
