const { createStore, combineReducers, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const {
  DEFAULTS,
  VIEW_CALENDAR,
  CALENDAR,
  MAIN_AUTOCOMPLETE_CREATED,
  FORM_AUTOCOMPLETE_CREATED,
  UPDATE_CALENDAR_INPUT,
  VIEW_CREATE_TRIP,
  CREATE_TRIP,
  CREATE_TRIP_DESTINATION_INPUT,
  UPDATE_CREATE_TRIP_INPUT,
  CHANGE_FILTER
} = require('./variables.js');

const initialState = {
  currentUser: DEFAULTS.USER,
  currentView: DEFAULTS.VIEW,
  calendar: {
    filter: null,
    trips: [],
    input: '',
    autocomplete: null
  },
  createTrip: {
    title: null,
    description: null,
    destinationCount: 0,
    destinations: [],
    notes: null,
    autocompletes: []
  },
  modifyTrip: {
    title: null,
    description: null,
    destinationCount: null,
    destinations: [],
    notes: null
  }
};

const currentUser = (state = initialState.currentUser, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

const currentView = (state = initialState.currentView, action) => {
  switch (action.type) {
    case VIEW_CALENDAR:
      return CALENDAR;
    case VIEW_CREATE_TRIP:
      return CREATE_TRIP;
    default:
      return state;
  }
}

const calendar = (state = initialState.calendar, action) => {
  switch (action.type) {
    case MAIN_AUTOCOMPLETE_CREATED:
      return Object.assign({}, state, {
        autocomplete: action.autocomplete
      })
    case CHANGE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
        trips: [...action.trips]
      })
    case UPDATE_CALENDAR_INPUT:
      return Object.assign({}, state, {
        input: action.value
      })
    case VIEW_CREATE_TRIP:
      return Object.assign({}, state, {
        input: ''
      })
    default:
      return state;
  }
}

const createTrip = (state = initialState.createTrip, action) => {
  switch (action.type) {
    case VIEW_CREATE_TRIP:
      return Object.assign({}, state, {
        title: action.title,
        description: null,
        destinationCount: 1,
        destinations: [action.destination],
        notes: null,
        autocompletes: []
      })
    case FORM_AUTOCOMPLETE_CREATED:
      return Object.assign({}, state,{
        autocompletes: [
          ...state.autocompletes.slice().splice(0, action.index),
          action.autocomplete,
          ...state.autocompletes.slice().splice(action.index+1)
        ]
      })
    case UPDATE_CREATE_TRIP_INPUT:
      return Object.assign({}, state, {
        [action.key]: action.value
      })
    case CREATE_TRIP_DESTINATION_INPUT:
      return Object.assign({}, state, {
        destinations: [
          ...state.destinations.slice().splice(0, action.index),
          Object.assign({}, state.destinations[action.index], action.value),
          ...state.destinations.slice().splice(action.index+1)
        ]
      })
    default:
      return state;
  }
}

const modifyTrip = (state = initialState.modifyTrip, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

const reducer = combineReducers({ currentUser, currentView, calendar, createTrip, modifyTrip });

const store = createStore(reducer, initialState, applyMiddleware(thunk));

module.exports = store;
