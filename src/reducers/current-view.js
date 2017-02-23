const DEFAULTS = require('../constants/defaults.js');
const { VIEW_CHANGED, TRIP_ADDED, TRIP_MODIFIED } = require('../constants/action-types.js');
const { CALENDAR } = require('../constants/views.js')

const initialState = DEFAULTS.VIEW;

const currentView = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_CHANGED:
      return action.view;
    case TRIP_ADDED:
    case TRIP_MODIFIED:
      return CALENDAR;
    default:
      return state;
  }
}

module.exports = currentView;
