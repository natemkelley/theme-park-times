var express = require('express');
var app = express()
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/disneyRideTimes',{
    useNewUrlParser: true
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
