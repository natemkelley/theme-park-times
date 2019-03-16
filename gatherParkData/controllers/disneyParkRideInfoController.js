var mongoose = require('mongoose');
var colors = require('colors');


//rideTime Schema
require('../models/rideInfoModel')
var rideInfoModel = mongoose.model('rideInfoModel');

exports.saveRideInformation = function (rideInfo) {
    return new Promise((resolve, reject) => {
        var saveThisRide = new rideInfoModel(rideInfo);

        rideInfoModel.find({
            name: saveThisRide.name
        }, function (err, docs) {
            if (docs.length) {
                //console.log('already exists'.cyan);
            } else {
                saveThisRide.save(function (err) {
                    if (err) reject(false);
                    console.log(colors.green(rideInfo.name));
                    resolve(true)
                });
            }
        });
    })
}