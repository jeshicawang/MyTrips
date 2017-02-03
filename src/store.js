const { createStore, combineReducers, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const { DEFAULTS, CHANGE_FILTER, AUTOCOMPLETE_CREATED } = require('./actions.js')

const initialState = {
  currentUser: DEFAULTS.USER,
  currentView: DEFAULTS.VIEW,
  calendar: {
    filter: null,
    trips: [],
    autocomplete: null
  },
  createTrip: {
    title: null,
    description: null,
    destinationCount: 1,
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
    case AUTOCOMPLETE_CREATED:
      return Object.assign({}, state, {
        autocomplete: action.autocomplete
      })
    default:
      return state;
  }
}

const createTrip = (state = initialState.createTrip, action) => {
  switch (action.type) {
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
