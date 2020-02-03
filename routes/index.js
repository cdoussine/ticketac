var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journeys');
var userModel = require('../models/users');

var city = [
  'Paris',
  'Marseille',
  'Nantes',
  'Lyon',
  'Rennes',
  'Melun',
  'Bordeaux',
  'Lille'
];
var date = [
  '2018-11-20',
  '2018-11-21',
  '2018-11-22',
  '2018-11-23',
  '2018-11-24'
];

/* GET Login. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    req.session.user = null;
    req.session.basket = null;
  }
  res.render('login', {});
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    res.render('index', {});
  }
});

router.get('/trips', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    console.log(req.session.user);
    var userPopulated = await userModel
      .findById(req.session.user._id)
      .populate('journeys')
      .exec();
    console.log(userPopulated);
    res.render('basket', { basket: userPopulated.journeys, type: 'trip' });
  }
});

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {
  // How many journeys we want
  var count = 300;

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {
    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

    if (departureCity != arrivalCity) {
      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ':00',
        price: Math.floor(Math.random() * Math.floor(125)) + 25
      });

      await newUser.save();
    }
  }
  res.render('index', { title: 'Express' });
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {
  // Permet de savoir combien de trajets il y a par ville en base
  for (i = 0; i < city.length; i++) {
    journeyModel.find(
      { departure: city[i] }, //filtre

      function(err, journey) {
        console.log(
          `Nombre de trajets au départ de ${journey[0].departure} : `,
          journey.length
        );
      }
    );
  }

  res.render('index', { title: 'Express' });
});

router.post('/search', async function(req, res, next) {
  var departure =
    req.body.departure[0].toUpperCase() +
    req.body.departure.slice(1).toLowerCase();

  var arrival =
    req.body.arrival[0].toUpperCase() + req.body.arrival.slice(1).toLowerCase();

  var date = req.body.date;

  console.log(departure, arrival, date);

  var journeys = await journeyModel.find({ departure, arrival, date });

  console.log(journeys);

  res.render('journeys', { journeys });
});

router.post('/basket', async function(req, res, next) {
  console.log(req.body.id);

  var journey = await journeyModel.findById(req.body.id);

  console.log(journey);

  if (!req.session.basket) {
    req.session.basket = [];
  }

  req.session.basket.push(journey);

  res.render('basket', { basket: req.session.basket, type: 'basket' });
});

router.post('/book', async function(req, res, next) {
  if (req.session.basket) {
    var user = await userModel.findById(req.session.user._id);

    for (var i = 0; i < req.session.basket.length; i++) {
      if (!user.journeys) {
        user.journeys = [];
      }
      console.log('id', req.session.basket[i]._id);
      user.journeys.push(req.session.basket[i]._id);
    }

    var userSaved = await user.save();

    res.redirect('/home');
  }
});

module.exports = router;
