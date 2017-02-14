const { DEFAULTS, VIEW_CALENDAR, CALENDAR, VIEW_CREATE_TRIP, CREATE_TRIP } = require('../actions/action-types.js');

const initialState = DEFAULTS.VIEW;

const currentView = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_CALENDAR:
      return CALENDAR;
    case VIEW_CREATE_TRIP:
      return CREATE_TRIP;
    default:
      return state;
  }
}

module.exports = currentView;
