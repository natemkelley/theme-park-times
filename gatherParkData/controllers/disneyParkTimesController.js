var mongoose = require('mongoose');
var moment = require('moment');
var colors = require('colors');


//rideTime Schema
require('../models/rideTimeModel')
const rideTimeDay = mongoose.model('rideTimes');

exports.saveRideTime = function (ride) {
    return new Promise((resolve, reject) => {

        getRideDayInDatabase(ride)
            .then(rideID => {
                return rideID
            })
            .then(rideID => {
                return new Promise((resolve, reject) => {
                    if (!rideID) {
                        resolve(rideID);
                        return
                    }

                    isThisGonnaBeDuplicateData(rideID, ride).then(status => {
                        if (!status) {
                            resolve(rideID);
                        } else {
                            console.log(colors.red('dup timestamp -> ' + ride.name + ' -> ' + ride.parkName))
                            return
                        }
                    })
                })
            })
            .then(rideID => {
                if (rideID) {
                    createStatus(rideID, ride).then(saveStatus => {
                        resolve(saveStatus)
                    })
                } else {
                    createRideAndDay(ride).then(dayAndRideID => {
                        createStatus(dayAndRideID, ride).then(saveStatus => {
                            resolve(saveStatus)
                        })
                    })
                }
            })
    })

    function isThisGonnaBeDuplicateData(dayAndRideID, ride) {
        return new Promise((resolve, reject) => {
            rideTimeDay
                .findOne({
                    _id: dayAndRideID
                }, {
                    rideStatus: {
                        $slice: -1
                    }
                })
                .then(docs => {
                    var tenMinutesAgo = moment(ride.lastUpdate).subtract(8, "minutes");
                    var timeInDB = docs.rideStatus[0].lastUpdate;

                    if (moment(tenMinutesAgo).isAfter(timeInDB, 'minute')) {
                        console.log("\nten minutes ago "+ moment(tenMinutesAgo).format('llll'));
                        console.log("time in db "+colors.yellow(moment(timeInDB).format('llll')))
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
        })
    }

    function getRideDayInDatabase(ride) {
        return new Promise((resolve, reject) => {
            var returnStatus = false;
            rideTimeDay
                .findOne({
                    name: ride.name,
                    date: ride.date,
                    parkName: ride.parkName
                })
                .then(docs => {
                    if (docs) {
                        returnStatus = docs._id
                    }
                    resolve(returnStatus)
                })
        })
    }

    function createStatus(dayAndRideID, ride) {
        return new Promise((resolve, reject) => {
            var newStatus = {
                status: ride.status,
                waitTime: ride.waitTime,
                lastUpdate: ride.lastUpdate
            }

            rideTimeDay
                .findOne({
                    _id: dayAndRideID
                })
                .then(docs => {
                    var updateRideStatus = rideTimeDay(docs);
                    updateRideStatus.rideStatus.push(newStatus);

                    updateRideStatus.save(function (err, data) {
                        if (err) {
                            console.log(colors.red(updateRideStatus.name + " " + updateRideStatus._id));
                            console.log(colors.red(err));
                            reject(false);
                        }
                        console.log(colors.cyan(updateRideStatus.parkName + " -> " + updateRideStatus.name + " -> wait time of ") + colors.underline.white(newStatus.waitTime));
                        resolve(true)
                    })
                })
        })
    }

    function createRideAndDay(ride) {
        return new Promise((resolve, reject) => {
            var createThisRide = new rideTimeDay({
                id: ride.id,
                name: ride.name,
                parkName: ride.parkName,
                date: ride.date,
                schedule: ride.schedule,
                rideStatus: [],
            });

            createThisRide.save(function (err, data) {
                if (err) reject(false);
                //console.log(colors.green("Created -> " + ride.parkName + "-> " + ride.name) + colors.white(" -> " + ride.date));
                resolve(data._id);
            })
        })
    }

}

function removeAll() {
    var removeAll = rideTimeDay.deleteMany({});
    removeAll.then(function (log, err) {
        if (log) {
            console.log('deleting all tweets status '.red + JSON.stringify(log).red);
        }
    });
}

//removeAll();
