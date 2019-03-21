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
                //console.log('info already exists'.white);
            } else {
                saveThisRide.save(function (err) {
                    if (err) reject(false);
                    console.log(colors.green("Info created "+rideInformation.name) +" -> id: -> "+rideInformation.rideTimeID);
                    resolve(true)
                });
            }
        });
    })
}

exports.getRideIDByPark = function (rideName, park) {
    return new Promise((resolve, reject) => {
        rideName = specialCases(rideName)

        var newrideName = new RegExp(".*" + rideName.substring(0, 16) + ".*");

        rideTimeDay
            .find({
                name: {
                    $regex: newrideName,
                    '$options': 'i'
                },
                parkName: park
            })
            .then(docs => {

                if (docs.length > 1) {
                    resolve(docs[docs.length - 1].id);
                }

                if (docs.length == 0) {
                    resolve(false);
                }

                if (docs.length == 1) {
                    resolve(docs[0].id)
                }

            })

    })




    function specialCases(rideName) {
        if (rideName.substr(0, 1) == "T") {
            if (rideName.includes('The')) {
                rideName = rideName.replace('The ', '');
            }
        }

        if (rideName.includes('Walt Disney World')) {
            rideName = rideName.replace('Walt Disney World', '');
        }

        if (rideName.includes('Disney & Pixar')) {
            rideName = rideName.replace('&', 'and');
        }

        if (rideName.includes('Mission: SPACE')) {
            rideName = 'Mission: SPACE'
        }

        if (rideName.includes('Star Tours')) {
            rideName = rideName.replace(':', ' -');
        }

        rideName = rideName.replace('~', '-');

        return rideName
    }

    function returnedValueSpecialCases(rideName) {
        if (rideName.includes('Maharaj')) {

        }
    }

}
