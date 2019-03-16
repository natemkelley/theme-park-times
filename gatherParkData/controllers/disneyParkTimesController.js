var mongoose = require('mongoose');
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
        
        saveThisRide.save(function (err) {
            if (err) reject(false);
            console.log(colors.green(ride.name + " with a wait time of ") + colors.underline.white(ride.waitTime));
            resolve(true)
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
removeAll();
/*exports.saveTwitterSimulation = function (twitterSimulationData, user, nameOfSim, private, groups) {
    return new Promise((resolve, reject) => {
        var saveThisTwitterSimulation = new twitterSimulationModel({
            date: new Date(),
            user: user,
            nameOfSim: nameOfSim,
            type: 'twitter',
            groups: groups,
            private: private,
            views: 0,
            simulation: twitterSimulationData
        });
        saveThisTwitterSimulation.save(function (err) {
            if (err) return handleError(err);
            console.log('saved tweet saved successfully'.green);

            var returnVal = {
                status: true
            };
            resolve(returnVal)
        });

    })
}*/


exports.list_all_tasks = function (req, res) {
    rideTime.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
