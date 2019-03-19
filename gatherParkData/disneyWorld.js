var colors = require('colors');
var Themeparks = require("themeparks");
var moment = require("moment");
var request = require("request")
var disneyParkController = require('../gatherParkData/controllers/disneyParkTimesController.js')
var disneyRideController = require('../gatherParkData/controllers/disneyParkRideInfoController.js')


//parks
var disneyMagicKingdom = new Themeparks.Parks.WaltDisneyWorldMagicKingdom();
var disneyAnimalKingdom = new Themeparks.Parks.WaltDisneyWorldAnimalKingdom();
var disneyEpcot = new Themeparks.Parks.WaltDisneyWorldEpcot();
var disneyHollywoodStudios = new Themeparks.Parks.WaltDisneyWorldHollywoodStudios();
var disneyLand = new Themeparks.Parks.DisneylandResortMagicKingdom();
var disneyCaliforniaAdventure = new Themeparks.Parks.DisneylandResortCaliforniaAdventure();

//create array
var parksArray = [];
parksArray.push(disneyMagicKingdom)
parksArray.push(disneyAnimalKingdom)
parksArray.push(disneyEpcot)
parksArray.push(disneyHollywoodStudios)
parksArray.push(disneyLand)
parksArray.push(disneyCaliforniaAdventure)


//start collecting ride times
require('./disneyWorldRideTimes')(parksArray);


//start collecting park information
var parksArrayForAttractions = ['magic-kingdom', 'animal-kingdom', 'epcot', 'hollywood-studios','disneyland','disney-california-adventure']
//require('./disneyWorldRideInfo')(parksArrayForAttractions);

