var express = require('express');
var app = express()
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb://localhost/disneyRideTimes', {
    useNewUrlParser: true
});
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open'.green);
});


//body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//start server
app.listen(port);
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
console.log('RESTful API server started on:', port);


//start pinging for data
var magicKingdom = require('./gatherParkData/disneyWorld.js')
