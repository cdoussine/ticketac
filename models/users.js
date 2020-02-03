var mongoose = require('../models/bdd');

var journeyModel = require('./journeys');

// Creation of a new schema for our cities
var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  journeys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'journey' }]
});

// Creation of a new model for our cities
var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
