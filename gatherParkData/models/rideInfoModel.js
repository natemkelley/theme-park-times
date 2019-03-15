var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rideInfoScheme = new Schema({
    
}, {
    strict: false
});

mongoose.model('rideInfoModel', rideInfoScheme);
