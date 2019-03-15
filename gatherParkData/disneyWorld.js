var colors = require('colors');
var Themeparks = require("themeparks");
var moment = require("moment")
var disneyMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
var disneyAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
var disneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
var disneyHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
var fifteenMinutes = 1000 * 60 * 15;


//create array
var parksArray = [];
parksArray.push(disneyMagicKingdom)
parksArray.push(disneyAnimalKingdom)
parksArray.push(disneyEpcot)
parksArray.push(disneyHollywoodStudios)


parksArray.forEach(function (parkObject) {
    getParkTimes(parkObject).then((parkTimesObject) => {
        console.log(parkTimesObject);
        getWaitTimesparkObject(parkObject);
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
    return new Promise((resolve, reject) => {
        parkObject.GetWaitTimes().then(function (rides) {
            for (var i = 0, ride; ride = rides[i++];) {
                if (true) {
                    console.log(ride.name);
                }
            }
        }, console.error);

    })

}
