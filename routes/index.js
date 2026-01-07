const flightRoute = require('./flights')
const siteRoute = require('./sites')
const airlineController = require('../controllers/AirlineController');
const airportController = require('../controllers/AirportController');
const adminRoute = require('./admin')
const hotelRoute = require('./hotel');
const User = require('../models/User'); 
const paymentRoute = require("./payment");

function initRoute(app) {
    // [GET,POST,PUT,....] Get flights
    app.use('/select-flight',  flightRoute);
    // [GET] home page
    app.use('/',siteRoute); 
    //Admin page
    app.use('/admin', adminRoute);
    //
    app.use('/discover', hotelRoute);
    //
    app.use("/payment", paymentRoute);
    //
    app.get('/profile', (req, res) => {
    const email = req.query.email;
    // load user từ DB theo email
    User.findOne({ email }).then(user => {
        res.render('profile', { user });
    }).catch(err => res.send('Lỗi load user'));
});

    

    app.use("/payment", require("./payment"));
    //app.use("/booking-detail", require("./payment"));


}
module.exports =  initRoute ;