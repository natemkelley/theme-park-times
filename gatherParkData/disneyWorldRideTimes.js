var colors = require('colors');
var moment = require("moment");
var mongoose = require("mongoose");
var disneyParkController = require('../gatherParkData/controllers/disneyParkTimesController.js')
var TWOMINUTES = 1000 * 60 * 2;

module.exports = function (parksArray) {
    if (parksArray) {
        setInterval(function () {
            loopForWaitTimes(parksArray)
        }, TWOMINUTES);

        //start the first function
        loopForWaitTimes(parksArray);
    }
}

function loopForWaitTimes(parksArray) {
    console.log(colors.yellow('starting parks loop -> ' + moment().format('LTS')));

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
                        var INCREMENT = 100;
                        parkRidesArray.forEach(function (ride) {
                            disneyParkController.saveRideTime(ride);
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
            let time = parkObject.TimeNow();
            let timezone = parkObject.Timezone;
            let date = parkObject.DateNow();

            let currentTime = moment(time).tz(timezone).format();
            let openingTime = openingTimes[0].openingTime;
            let closingTime = openingTimes[0].closingTime;

            parkObject.GetWaitTimes().then(rides => {
                rides.forEach(function (ride) {
                    if (ride.hasOwnProperty('schedule')) {
                        if (ride.hasOwnProperty('special')) {
                            openingTime = ride.schedule.special[0].openingTime;
                            closingTime = ride.schedule.special[0].closingTime
                        }
                    }

                    returnJSON.date = date;
                    returnJSON.currentTime = currentTime;
                    returnJSON.openingTime = openingTime;
                    returnJSON.closingTime = closingTime;

                    resolve(returnJSON)
                })
            })
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
