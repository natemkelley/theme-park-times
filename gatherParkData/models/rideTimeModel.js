var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var RideTimeSchema = new Schema({
    name: String,
    waitTime: Number,
    lastUpdate: Date,
    status: String,
    active: Bool,
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

module.exports = mongoose.model('rideTime', RideTimeSchema);


/*{
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
}*/
