var colors = require('colors');
var Themeparks = require("themeparks");
var moment = require("moment")
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
        console.log(parkTimesObject);
        getWaitTimesparkObject(parkObject).then((parkRidesArray) => {
            parkRidesArray.forEach(function (ride) {
                console.log(ride)
            })
        });
    })
});





function getParkTimes(parkObject) {
    var returnJSON = {};
    return new Promise((resolve, reject) => {
        parkObject.GetOpeningTimes().then(function (openingTimes) {
            var time = parkObject.TimeNow();
            var timezone = parkObject.Timezone;
            var name = parkObject.Name;
            var date = parkObject.DateNow();
            var currentTime = moment(time).tz(parkObject.Timezone);
            var openingTime = openingTimes[0].openingTime;
            var closingTime = openingTimes[0].closingTime;

            returnJSON.date = date;
            returnJSON.name = name;
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
                if (true) {
                    rideObject.name = ride.name;
                    rideObject.waitTime = ride.waitTime;
                    rideObject.lastUpdate = ride.lastUpdate;
                    rideObject.status = ride.status;
                    rideObject.active = ride.active;

                    if (parkObject.SupportsRideSchedules) {
                        rideObject.schedule = ride.schedule;
                    }

                    returnArray.push(rideObject)
                }
            }

            resolve(returnArray);
        }, console.error);

    })

}
