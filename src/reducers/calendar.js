const { updateObject } = require('./utilities.js')
const { MAIN_AUTOCOMPLETE_CREATED, CHANGE_FILTER, UPDATE_CALENDAR_INPUT, VIEW_CREATE_TRIP } = require('../constants/action-types.js');

const initialState = {
  filter: null,
  trips: [],
  input: '',
  autocomplete: null
};

const calendar = (state = initialState, action) => {
  switch (action.type) {
    case MAIN_AUTOCOMPLETE_CREATED:
      return updateObject(state, {
        autocomplete: action.autocomplete
      })
    case CHANGE_FILTER:
      return updateObject(state, {
        filter: action.filter,
        trips: [...action.trips]
      })
    case UPDATE_CALENDAR_INPUT:
      return updateObject(state, {
        input: action.value
      })
    case VIEW_CREATE_TRIP:
      return updateObject(state, {
        input: ''
      })
    default:
      return state;
  }
}

module.exports = calendar;
