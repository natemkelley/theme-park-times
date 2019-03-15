var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RideTimeSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('rideTime', RideTimeSchema);