var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    date: Date,
    id: String,
    name: String,
    parkName: String
},{versionKey: false})


mongoose.model('rideTimes', RideTimeDaySchema);
mongoose.model('rideTimeDayStatus', RideTimeDayStatusScema);

/*
var RideTimeMinifiedSchema = new Schema({
    id: String,
    name: String,
    parkName: String,
    days: [RideTimeDaySchema],
});

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

*/