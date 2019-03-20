var mongoose = require('mongoose');
var colors = require('colors');

//rideTime Schema
require('../models/rideTimeModel')
const rideTimeDay = mongoose.model('rideTimes');

//rideInfo Schema
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

exports.getRideIDByPark = function (rideName, park) {
    //rideName = /.*Pirate.*/
    //var newrideName = new RegExp(".*" + rideName + ".*");
    var newrideName = new RegExp(".*" + rideName.substring(0, 16) + ".*");

    rideTimeDay
        .find({
            name: {
                $regex: newrideName
            },
            parkName: park
        })
        .then(docs => {
        
            console.log(colors.white(newrideName))
            if (docs.length > 1) {
                console.log(colors.cyan(rideName.substring(0, (rideName.length - 3)) + "->" + park));
                docs.forEach(function (data) {
                    console.log(colors.yellow(data.name + "->" + park));
                })
            }

            if (docs.length==0) {
                console.log(colors.red(rideName + "->" + park));
            }
        
            if(docs.length == 1){
                console.log(colors.green(rideName + "->" + park));
            }

            //console.log(docs)
        })


}
