var mongoose = require('mongoose');
var rideTime = mongoose.model('rideTime');


exports.list_all_tasks = function (req, res) {
    rideTime.find({}, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.testing = function (req, res) {
    res.send({task:'123'});
};

exports.read_a_task = function (req, res) {
    rideTime.findById(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};
