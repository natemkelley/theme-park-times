var colors = require('colors');
var Themeparks = require("themeparks");
var moment = require("moment");
var request = require("request")
var disneyParkController = require('../gatherParkData/controllers/disneyParkTimesController.js')
var disneyRideController = require('../gatherParkData/controllers/disneyParkRideInfoController.js')

var FIFTEENMINUTES = 1000 * 60 * 15;


//parks
var disneyMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
var disneyAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
var disneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
var disneyHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();

//create array
var parksArray = [];
parksArray.push(disneyMagicKingdom)
parksArray.push(disneyAnimalKingdom)
parksArray.push(disneyEpcot)
parksArray.push(disneyHollywoodStudios)


//start collecting ride times
require('./disneyWorldRideTimes')(parksArray);


//start collecting park information
var parksArrayForAttractions = ['magic-kingdom', 'animal-kingdom', 'epcot', 'hollywood-studios']
require('./disneyWorldRideInfo')(parksArrayForAttractions);

