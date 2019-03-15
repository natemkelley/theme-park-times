var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideTimeSchema = new Schema({
    id: String,
    name: String,
    waitTime: Number,
    lastUpdate: Date,
    status: String,
    active: Boolean,
    parkName: String,
    schedule: new Schema({
        date: Date,
        openingTime: Date,
        closingTime: Date,
        type: String
    }, {
        strict: false
    })
});

var test = new Schema({
    name: String,
});

mongoose.model('rideTimeModel', RideTimeSchema);
mongoose.model('test', test);
