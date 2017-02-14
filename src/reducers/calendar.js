const { updateObject } = require('./utilities.js')
const { CALENDAR } = require('../constants/views.js');
const { VIEW_CHANGED, AUTOCOMPLETE_CREATED, FILTER_CHANGED, TRIPS_FETCHED, UPDATE_CALENDAR_INPUT } = require('../constants/action-types.js');

const initialState = {
  filter: null,
  trips: [],
  input: '',
  autocomplete: null
};

const calendar = (state = initialState, action) => {
  if (action.view && action.view !== CALENDAR) return state;
  switch (action.type) {
    case AUTOCOMPLETE_CREATED:
      return updateObject(state, {
        autocomplete: action.autocomplete
      })
    case FILTER_CHANGED:
      return updateObject(state, {
        filter: action.filter
      })
    case TRIPS_FETCHED:
      return updateObject(state, {
        trips: [...action.trips]
      })
    case UPDATE_CALENDAR_INPUT:
      return updateObject(state, {
        input: action.value
      })
    case VIEW_CHANGED:
      return updateObject(state, {
        input: ''
      })
    default:
      return state;
  }
}

module.exports = calendar;
