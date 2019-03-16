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
require('../controllers/disneyParkTimesController');
var rideTimeModel = mongoose.model('rideTimeModel');


exports.saveRide = function (ride) {
    return new Promise((resolve, reject) => {

        var saveThisRide = new rideTimeModel({
            id: ride.id,
            name: ride.name,
            waitTime: ride.waitTime,
            lastUpdate: ride.lastUpdate,
            status: ride.status,
            active: ride.active,
            parkName: ride.parkName,
            schedule: ride.schedule
        });


        rideTimeModel
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
                    console.log(colors.cyan(saveThisRide.name + ' ---> timestamp already exists'))
                } 

                function JustSaveItAlready(saveThisRide, docs) {
                    return new Promise((resolve, reject) => {
                        saveThisRide.save(function (err) {
                            if (err) reject(false);
                            console.log(colors.green(ride.name + " with a wait time of ") + colors.underline.white(ride.waitTime));
                            resolve(true)
                        })
                    })
                }

            });
    })
}


function removeAll() {
    var removeAll = rideTimeModel.deleteMany({});
    removeAll.then(function (log, err) {
        if (log) {
            console.log('deleting all tweets status '.red + JSON.stringify(log).red);
        }
    });
}
