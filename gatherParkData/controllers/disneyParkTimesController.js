var mongoose = require('mongoose');
var moment = require('moment');
var colors = require('colors');

//connect to database
mongoose.connect('mongodb://localhost/disneyRideTimes', {
    useNewUrlParser: true
});
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open'.green);
});


//rideTime Schema
require('../models/rideTimeModel')
const rideTime = mongoose.model('rideTime');
const rideTimeMinified = mongoose.model('rideTimeMinified');
const rideTimeDay = mongoose.model('rideTimeDay');


exports.saveRideTime = function (ride) {
    return new Promise((resolve, reject) => {
        createRideInDatabase(ride).then(createdRideID => {
            createRideDayInDatabase(createdRideID, ride).then(createdDayID => {
                createRideStatusInDatabase(createdDayID, ride);
            })
        })
    })

    function createRideStatusInDatabase(docDateID, ride) {
        return new Promise((resolve, reject) => {
            var newStatus = {
                status: ride.status,
                waitTime: ride.waitTime,
                lastUpdate: ride.lastUpdate
            }

            rideTimeMinified
                .findOne({
                    'days._id': docDateID,
                })
                .then(docs => {
                    var updateRideTime = rideTimeMinified(docs);
                    if (updateRideTime) {
                        var daysLength = updateRideTime.days.length;
                        updateRideTime.days[daysLength - 1].rideStatus.push(newStatus);
                        updateRideTime.save(function (err, data) {
                            if (err) reject(false);
                            console.log(colors.green(updateRideTime.parkName + "---> " + updateRideTime.name + " with a wait time of ") + colors.underline.white(newStatus.waitTime));
                        })
                    }
                })
        })
    }

    function createRideDayInDatabase(docRideID, ride) {
        return new Promise((resolve, reject) => {
            var newDay = {
                schedule: ride.schedule,
                rideStatus: [],
                date: ride.date
            }

            rideTimeMinified
                .findOne({
                    _id: docRideID
                })
                .then(docs => {
                    var updateRideDay = rideTimeMinified(docs);
                    updateRideDay.days.push(newDay);
                    updateRideDay.save(function(err, data){
                        resolve(data.days[data.days.length - 1]._id)
                    })
                })
        })
    }

    function createRideInDatabase(ride) {
        return new Promise((resolve, reject) => {
            var createThisRide = new rideTimeMinified({
                id: ride.id,
                name: ride.name,
                parkName: ride.parkName,
                days: [],
            });

            createThisRide.save(function (err, data) {
                if (err) reject(false);
                console.log(colors.green("Created ---> " + ride.parkName + "---> " + ride.name));
                resolve(data._id);
            })
        })
    }
}



/*exports.saveRide = function (ride) {
    return new Promise((resolve, reject) => {

        var saveThisRide = new rideTime({
            id: ride.id,
            name: ride.name,
            waitTime: ride.waitTime,
            lastUpdate: ride.lastUpdate,
            status: ride.status,
            active: ride.active,
            parkName: ride.parkName,
            schedule: ride.schedule
        });

        rideTime
            .find({
                id: saveThisRide.id
            })
            .sort({
                lastUpdate: -1
            })
            .limit(1)
            .then(docs => {
                const PARSE_FORMAT = 'M/D/YYYY, H:mm:ss A';
                const fifteenMinutesAgo = moment(saveThisRide.lastUpdate).subtract(15, 'minutes')

                if (docs.length == 0 || docs == undefined) {
                    JustSaveItAlready(saveThisRide, docs);
                    resolve(true);
                    return
                }

                if (moment(fifteenMinutesAgo).isAfter(docs[0].lastUpdate, 'minute')) {
                    JustSaveItAlready(saveThisRide, docs);
                    resolve(true)
                } else {
                    console.log(colors.cyan(saveThisRide.parkName + " ---> " + saveThisRide.name + ' ---> timestamp already exists'))
                }

                function JustSaveItAlready(saveThisRide, docs) {
                    return new Promise((resolve, reject) => {
                        saveThisRide.save(function (err) {
                            if (err) reject(false);
                            console.log(colors.green(saveThisRide.parkName + "---> " + ride.name + " with a wait time of ") + colors.underline.white(ride.waitTime));
                            resolve(true)
                        })
                    })
                }

            });
    })
}*/

function removeAll() {
    var removeAll = rideTimeMinified.deleteMany({});
    removeAll.then(function (log, err) {
        if (log) {
            console.log('deleting all tweets status '.red + JSON.stringify(log).red);
        }
    });
}

removeAll();
