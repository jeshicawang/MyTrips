const { combineReducers } = require('redux');
const currentUser = require('./current-user.js');
const currentView = require('./current-view.js');
const calendar = require('./calendar.js');
const createTrip = require('./create-trip.js');
const modifyTrip = require('./modify-trip.js');

const rootReducer = combineReducers({ currentUser, currentView, calendar, createTrip, modifyTrip });

module.exports = rootReducer;
