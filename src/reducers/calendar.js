const { assign } = require('./utilities.js')
const { CALENDAR } = require('../constants/views.js');
const { VIEW_CHANGED, TRIP_ADDED, TRIP_MODIFIED, AUTOCOMPLETE_CREATED, FILTER_CHANGED, DROPDOWN_TOGGLED, TRIPS_FETCHED, MAIN_AUTOCOMPLETE_UPDATED } = require('../constants/action-types.js');
const { updateItemInArray } = require('./utilities.js')

const initialState = {
  filter: null,
  trips: [],
  dropdowns: [],
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
    case TRIP_MODIFIED:
      return assign(state, {
        filter: action.filter,
        input: '',
        autocomplete: null
      })
    case DROPDOWN_TOGGLED:
      return assign(state, {
        dropdowns: updateItemInArray(state.dropdowns, action.index, dropdown => !dropdown)
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
        trips: [...action.trips],
        dropdowns: [...action.trips].fill(false)
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
