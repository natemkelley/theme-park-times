var mongoose = require('mongoose');
var colors = require('colors');


//rideTime Schema
require('../models/rideInfoModel')
var rideInfo = mongoose.model('rideInfo');

exports.saveRideInformation = function (rideInformation) {
    return new Promise((resolve, reject) => {
        var saveThisRide = new rideInfo(rideInformation);

        rideInfo.find({
            name: saveThisRide.name
        }, function (err, docs) {
            if (docs.length) {
                console.log('info already exists'.rainbow);
            } else {
                saveThisRide.save(function (err) {
                    if (err) reject(false);
                    console.log(colors.green(rideInformation.name));
                    resolve(true)
                });
            }
        });
    })
}