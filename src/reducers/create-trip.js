/* eslint-disable no-case-declarations */

const { assign, updateItemInArray, newEmptyDestination } = require('./utilities.js')
const { CREATE_TRIP } = require('../constants/views.js');
const { VIEW_CHANGED, TRIP_ADDED, TRIP_FORM_LOADED, AUTOCOMPLETE_CREATED, INPUT_UPDATED, DESTINATION_INPUT_UPDATED, DESTINATION_ADDED } = require('../constants/action-types.js');

const initialState = {
  title: null,
  description: null,
  destinations: [],
  notes: null,
  autocompletes: []
};

const createTrip = (state = initialState, action) => {
  if (action.view && action.view !== CREATE_TRIP) return state;
  switch (action.type) {
    case VIEW_CHANGED:
    case TRIP_ADDED:
      return assign(state, initialState);
    case TRIP_FORM_LOADED:
      const { title, destination } = action.tripInfo;
      return assign(state, {
        title,
        destinations: [destination]
      })
    case AUTOCOMPLETE_CREATED:
      return assign(state, {
        autocompletes: [...state.autocompletes, action.autocomplete]
      })
    case INPUT_UPDATED:
      return assign(state, {
        [action.key]: action.value
      })
    case DESTINATION_INPUT_UPDATED:
      return assign(state, {
        destinations: updateItemInArray(state.destinations, action.index, (destination) => assign(destination, action.value))
      })
    case DESTINATION_ADDED:
      return assign(state, {
        destinations: [...state.destinations, newEmptyDestination()]
      })
    default:
      return state;
  }
}

module.exports = createTrip;
