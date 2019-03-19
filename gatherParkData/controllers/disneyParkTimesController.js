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
                            console.log(colors.red('duplicate timestamp -> ' + ride.name))
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
                        $slice: 1
                    },
                    schedule: 0,
                    name: 0,
                    parkName: 0,
                    date: 0,
                    id: 0,
                    _id: 0
                })
                .then(docs => {
                    const PARSE_FORMAT = 'M/D/YYYY, H:mm:ss A';
                    var tenMinutesAgo = moment(ride.lastUpdate).subtract(9,"minutes");
                    var timeInDB = docs.rideStatus[0].lastUpdate;
                    //console.log(moment(tenMinutesAgo).format('llll'));
                    //console.log(colors.yellow(moment(timeInDB).format('llll')))

                    if (moment(tenMinutesAgo).isAfter(timeInDB, 'minute')) {
                        resolve(false)
                    } else {
                        resolve(true)
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
                    date: ride.date
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
                            console.log(colors.yellow(updateRideStatus.name + " " + updateRideStatus._id));
                            console.log(colors.red(err))
                            reject(false);
                        }
                        console.log(colors.cyan(updateRideStatus.parkName + "---> " + updateRideStatus.name + " with a wait time of ") + colors.underline.white(newStatus.waitTime));
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
}*/
