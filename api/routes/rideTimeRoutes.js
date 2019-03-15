module.exports = function (app) {

    var rideTime = require('../controllers/disneyParkTimesController');

    app.get('/', function (req, res) {
        res.send('this is a sample!');
    });


    // todoList Routes
    app.route('/test')
        .get(rideTime.testing)


};
