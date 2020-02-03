var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

/* GET home page. */
router.post('/sign-up', async function(req, res, next) {
  var firstNameFromFront = req.body.firstNameFromFront;
  var lastNameFromFront = req.body.lastNameFromFront;
  var emailFromFront = req.body.emailFromFront;
  var passwordFromFront = req.body.passwordFromFront;

  console.log(firstNameFromFront, emailFromFront, passwordFromFront);

  var user = await userModel.findOne({ email: emailFromFront }, function(
    err,
    users
  ) {
    console.log(users);
  });

  if (user) {
    res.redirect('/');
  } else {
    // We create our new User
    var newUser = new userModel({
      firstName: firstNameFromFront,
      lastName: lastNameFromFront,
      email: emailFromFront,
      password: passwordFromFront
    });

    // We save our new User in our MongoDB
    var userSaveToDb = await newUser.save();

    req.session.user = userSaveToDb;

    res.redirect('/home');
  }
});

router.post('/sign-in', async function(req, res, next) {
  var emailFromFront = req.body.emailFromFront;
  var passwordFromFront = req.body.passwordFromFront;

  console.log(emailFromFront, passwordFromFront);

  var user = await userModel.findOne(
    { email: emailFromFront, password: passwordFromFront },
    function(err, users) {
      console.log(users);
    }
  );

  if (user) {
    req.session.user = user;

    res.redirect('/home');
  } else {
    res.redirect('/');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
