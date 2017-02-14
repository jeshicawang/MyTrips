const DEFAULTS = require('../constants/defaults.js');
const { CALENDAR, CREATE_TRIP } = require('../constants/views.js');
const { VIEW_CALENDAR, VIEW_CREATE_TRIP } = require('../constants/action-types.js')

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
