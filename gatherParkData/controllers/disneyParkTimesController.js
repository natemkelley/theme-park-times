var mongoose = require('mongoose');
var moment = require('moment');
var colors = require('colors');

//rideTime Schema
require('../models/rideTimeModel')
const rideTimeDay = mongoose.model('rideTimes');


exports.getDownTime = function (rideName, parkName, lowerBound, upperBound) {
    return new Promise((resolve, reject) => {
        if (!rideName) {
            rideName = 'Splash Mount';
        }
        if (!parkName) {
            parkName = 'World';
        }
        if (!lowerBound) {
            lowerBound = moment('2010-03-22').toDate();
        }
        if (!upperBound) {
            upperBound = moment(new Date()).toDate();
        }

        rideTimeDay.aggregate()
            .match({
                'name': {
                    '$regex': rideName
                },
                'parkName': {
                    '$regex': parkName
                },
                'date': {
                    $lte: upperBound,
                    $gte: lowerBound
                }
            })
            .unwind({
                path: '$rideStatus'
            })
            .group({
                '_id': {
                    'name': '$name',
                    'parkName': '$parkName',
                    'date': '$date'
                },
                'DownCount': {
                    '$sum': {
                        '$cond': [
                            {
                                '$eq': [
                '$rideStatus.status', 'Down'
              ]
            },
                            1, 0
          ]
                    }
                },
                'OpCount': {
                    '$sum': {
                        '$cond': [
                            {
                                '$eq': [
                '$rideStatus.status', 'Operating'
              ]
            },
                            1, 0
          ]
                    }
                },
                'ClosedCount': {
                    '$sum': {
                        '$cond': [
                            {
                                '$eq': [
                '$rideStatus.status', 'Closed'
              ]
            },
                            1, 0
          ]
                    }
                },
                'TotCount': {
                    '$sum': 1
                }
            })
            .project({
                'name': 1,
                'ClosedCount': 1,
                'DownCount': 1,
                'OpCount': 1,
                'TotCount': 1,
                'downTime': {
                    '$divide': [
                        '$DownCount', '$TotCount'
                    ]
                }
            })
            .sort({
                'downTime': -1
            })
            .then(data => {
                console.log(colors.green('!!!!!!!!!!!!!!!!!!!!!!!'))
                console.log(data)
                resolve(data)
            })
    })
}

//get ride array for specific times
exports.queryForRide = function (rideName, parkName, lowerBound, upperBoud) {
    return new Promise((resolve, reject) => {
        if (!rideName) {
            rideName = 'Splash';
        }
        if (!parkName) {
            parkName = 'World';
        }
        if (!lowerBound) {
            lowerBound = moment('2019-03-22').toDate();
        }
        if (!upperBoud) {
            upperBoud = moment('2019-03-23').toDate();
        }
        rideTimeDay.aggregate()
            .match({
                'name': {
                    '$regex': rideName
                },
                'parkName': {
                    '$regex': parkName
                },
                'date': {
                    $lte: upperBoud,
                    $gte: lowerBound
                }
            })
            .unwind({
                path: '$rideStatus'
            })
            .group({
                '_id': {
                    'name': '$name',
                    'parkName': '$parkName'
                },
                'average': {
                    '$avg': '$rideStatus.waitTime'
                }
            })
            .then(data => {
                resolve(data)
            })
    })
}

//ride object contains: id, name, parkName, date, schedule, status, waitTime, lastUpdate
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
                            //console.log(colors.red('dup timestamp -> ' + ride.name + ' -> ' + ride.parkName))
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
                    var tenMinutesAgo = moment(new Date()).subtract(9, "minutes");
                    var timeInDB = docs.rideStatus[0].inputTime;

                    if (timeInDB == null) {
                        moment(new Date()).subtract(10, "days")
                    }

                    if (moment(tenMinutesAgo).isAfter(timeInDB, 'minute')) {
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
                lastUpdate: ride.lastUpdate,
                inputTime: new Date()
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
                console.log(colors.green("Created -> " + ride.parkName + "-> " + ride.name) + colors.white(" -> " + ride.date));
                resolve(data._id);
            })
        })
    }
}
