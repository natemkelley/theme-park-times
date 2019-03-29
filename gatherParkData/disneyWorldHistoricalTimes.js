var colors = require('colors');
var moment = require("moment");
var mongoose = require("mongoose");
var request = require("request");
var fs = require("fs");
const http = require('http');
var disneyRideInfo = require('../gatherParkData/controllers/disneyParkRideInfoController.js')
const csv = require('csvtojson')


module.exports = function () {
    csvFilesToDatabase();

}

function csvFilesToDatabase() {
    let historicalFolder = './example/historical/';



    function processCSV(filePath, cb) {

        csv()
            .fromFile(filePath)
            .then((jsonObj) => {
                console.log('done with', filePath);
                cb();
            })
    }


    fs.readdir(historicalFolder, (err, files) => {

        let requests = files.reduce((promiseChain, file) => {
            return promiseChain.then(() => new Promise((resolve) => {
                let csvFilePath = historicalFolder + file;
                processCSV(csvFilePath, resolve);
            }));
        }, Promise.resolve());

        requests.then(() => console.log('done'))

    })



}

function scrubfordata() {
    var datArray = ['http://cdn.touringplans.com/datasets/kilimanjaro_safaris.csv',
'http://cdn.touringplans.com/datasets/expedition_everest.csv',
'http://cdn.touringplans.com/datasets/dinosaur.csv',
'http://cdn.touringplans.com/datasets/spaceship_earth.csv',
'http://cdn.touringplans.com/datasets/soarin.csv',
'http://cdn.touringplans.com/datasets/rock_n_rollercoaster.csv',
'http://cdn.touringplans.com/datasets/toy_story_mania.csv',
'http://cdn.touringplans.com/datasets/splash_mountain.csv',
'http://cdn.touringplans.com/datasets/pirates_of_caribbean.csv',
'http://cdn.touringplans.com/datasets/navi_river.csv',
'http://cdn.touringplans.com/datasets/flight_of_passage.csv',
'http://cdn.touringplans.com/datasets/slinky_dog.csv',
'http://cdn.touringplans.com/datasets/alien_saucers.csv',
'http://cdn.touringplans.com/datasets/7_dwarfs_train.csv']
    var counter = 50;
    datArray.forEach(function (ride) {
        var shortName = ride.match(/\/([^\/]+)\/?$/)[1];
        shortName = shortName.substring(0, shortName.length - 4);

        setTimeout(function () {
            download(ride, shortName).then(status => {
                console.log(status)
            })
        }, counter);

        counter = counter + 500;
    })
}

function download(url, shortName) {
    var jsonStatus = {
        status: false,
        short_name: shortName
    }
    var dest = './example/historical/' + shortName + '.csv';

    return new Promise((resolve, reject) => {
        fs.exists(dest, (exists) => {
            if (!exists) {
                var file = fs.createWriteStream(dest);
                var request = http.get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        jsonStatus.status = true;
                        resolve(jsonStatus)
                    });
                }).on('error', function (err) {
                    fs.unlink(dest);
                    console.log(colors.red(err))
                    resolve(jsonStatus)
                });
            } else {
                resolve(jsonStatus)
            }
        });

    })

};

/*



*/
