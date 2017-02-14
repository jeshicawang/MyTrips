/* eslint-disable no-case-declarations */

const { updateObject, updateItemInArray, newEmptyDestination } = require('./utilities.js')
const { CREATE_TRIP } = require('../constants/views.js');
const { TRIP_INFO_UPDATED, AUTOCOMPLETE_CREATED, TRIP_FORM_INPUT_UPDATED, CREATE_TRIP_DESTINATION_INPUT, DESTINATION_ADDED } = require('../constants/action-types.js');

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
    case TRIP_INFO_UPDATED:
      const { title, destination } = action.tripInfo;
      return updateObject(state, {
        title,
        destinations: [destination]
      })
    case AUTOCOMPLETE_CREATED:
      return updateObject(state, {
        autocompletes: [...state.autocompletes, action.autocomplete]
      })
    case TRIP_FORM_INPUT_UPDATED:
      return updateObject(state, {
        [action.key]: action.value
      })
    case CREATE_TRIP_DESTINATION_INPUT:
      return updateObject(state, {
        destinations: updateItemInArray(state.destinations, action.index, (destination) => updateObject(destination, action.value))
      })
    case DESTINATION_ADDED:
      return updateObject(state, {
        destinations: [...state.destinations, newEmptyDestination()]
      })
    default:
      return state;
  }
}

module.exports = createTrip;
