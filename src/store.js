const { createStore, combineReducers, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const {
  DEFAULTS,
  VIEW_CALENDAR,
  CALENDAR,
  UPDATE_CALENDAR_INPUT,
  VIEW_CREATE_TRIP,
  CREATE_TRIP,
  CHANGE_FILTER,
  AUTOCOMPLETE_CREATED
} = require('./actions.js');

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
    destinationCount: null,
    destinations: [],
    notes: null
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
    case CHANGE_FILTER:
      return Object.assign({}, state, {
        filter: action.filter,
        trips: [...action.trips]
      })
    case UPDATE_CALENDAR_INPUT:
      return Object.assign({}, state, {
        input: action.value
      })
    case AUTOCOMPLETE_CREATED:
      return Object.assign({}, state, {
        autocomplete: action.autocomplete
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
        description: action.description,
        destinationCount: action.destinationCount,
        destinations: action.destinations,
        notes: action.notes
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
