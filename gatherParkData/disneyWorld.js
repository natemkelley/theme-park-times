var colors = require('colors');
var Themeparks = require("themeparks");
var moment = require("moment");
var disneyParkController = require('../gatherParkData/controllers/disneyParkTimesController.js')
var FIFTEENMINUTES = 1000 * 60 * 15;


//parks
var disneyMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
var disneyAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
var disneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
var disneyHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();

//create array
var parksArray = [];
parksArray.push(disneyMagicKingdom)
parksArray.push(disneyAnimalKingdom)
parksArray.push(disneyEpcot)
parksArray.push(disneyHollywoodStudios)


parksArray.forEach(function (parkObject) {
    getParkTimes(parkObject).then((parkTimesObject) => {
        if ((parkTimesObject.currentTime > parkTimesObject.openingTime) && (parkTimesObject.currentTime < parkTimesObject.closingTime)) {
            getWaitTimesparkObject(parkObject).then((parkRidesArray) => {
                parkRidesArray.forEach(function (ride) {
                    disneyParkController.saveRide(ride);
                })
            });
        }
    })
});



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
                    rideObject.date = moment(parkObject.DateNow()).tz(parkObject.Timezone).format('LL');

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
