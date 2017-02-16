const { assign } = require('./utilities.js')
const { CALENDAR } = require('../constants/views.js');
const { VIEW_CHANGED, TRIP_ADDED, AUTOCOMPLETE_CREATED, FILTER_CHANGED, TRIPS_FETCHED, MAIN_AUTOCOMPLETE_UPDATED } = require('../constants/action-types.js');

const initialState = {
  filter: null,
  trips: [],
  input: '',
  autocomplete: null
};

const calendar = (state = initialState, action) => {
  if (action.view && action.view !== CALENDAR) return state;
  switch (action.type) {
    case VIEW_CHANGED:
      return assign(state, {
        input: '',
        autocomplete: null
      })
    case TRIP_ADDED:
      return assign(state, {
        filter: action.filter,
        input: '',
        autocomplete: null
      })
    case AUTOCOMPLETE_CREATED:
      return assign(state, {
        autocomplete: action.autocomplete
      })
    case FILTER_CHANGED:
      return assign(state, {
        filter: action.filter
      })
    case TRIPS_FETCHED:
      return assign(state, {
        trips: [...action.trips]
      })
    case MAIN_AUTOCOMPLETE_UPDATED:
      return assign(state, {
        input: action.value
      })
    default:
      return state;
  }
}

module.exports = calendar;