var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideTimeDayStatusScema = new Schema({
    status: String,
    waitTime: Number,
    lastUpdate: Date,
    inputTime: Date
})

var specialSchema = new Schema({
    openingTime: Date,
    closingTime: Date,
    type: String
}, {
    strict: false
})

var RideTimeDaySchema = new Schema({
    schedule: new Schema({
        openingTime: Date,
        closingTime: Date,
        type: String,
        special: [specialSchema]
    }, {
        strict: false
    }),
    rideStatus: [RideTimeDayStatusScema],
    date: Date,
    id: String,
    name: String,
    parkName: String
}, {
    versionKey: false
})


mongoose.model('rideTimes', RideTimeDaySchema);
mongoose.model('rideTimeDayStatus', RideTimeDayStatusScema);
