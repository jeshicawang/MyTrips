const { updateObject, updateItemInArray } = require('./utilities.js')
const { VIEW_CREATE_TRIP, FORM_AUTOCOMPLETE_CREATED, UPDATE_CREATE_TRIP_INPUT, CREATE_TRIP_DESTINATION_INPUT } = require('../variables.js');

const initialState = {
  title: null,
  description: null,
  destinationCount: 0,
  destinations: [],
  notes: null,
  autocompletes: []
};

const createTrip = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_CREATE_TRIP:
      return updateObject(state, {
        title: action.title,
        destinationCount: 1,
        destinations: [action.destination]
      })
    case FORM_AUTOCOMPLETE_CREATED:
      return updateObject(state, {
        autocompletes: [...state.autocompletes, action.autocomplete]
      })
    case UPDATE_CREATE_TRIP_INPUT:
      return updateObject(state, {
        [action.key]: action.value
      })
    case CREATE_TRIP_DESTINATION_INPUT:
      return updateObject(state, {
        destinations: updateItemInArray(state.destinations, action.index, (destination) => updateObject(destination, action.value))
      })
    default:
      return state;
  }
}

module.exports = createTrip;
