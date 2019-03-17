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

var RideTimeDayStatusScema = new Schema({
    status: String,
    waitTime: Number,
    lastUpdate: Date
})

var RideTimeDaySchema = new Schema({
    schedule: new Schema({
        date: Date,
        openingTime: Date,
        closingTime: Date,
        type: String
    }, {
        strict: false
    }),
    rideStatus: [RideTimeDayStatusScema],
    date: Date
})

var RideTimeMinifiedSchema = new Schema({
    id: String,
    name: String,
    parkName: String,
    days: [RideTimeDaySchema],
});

var test = new Schema({
    name: String,
});

mongoose.model('rideTime', RideTimeSchema);
mongoose.model('rideTimeMinified', RideTimeMinifiedSchema);
mongoose.model('rideTimeDay', RideTimeDaySchema);
mongoose.model('rideTimeDayStatus', RideTimeDayStatusScema);
mongoose.model('test', test);
