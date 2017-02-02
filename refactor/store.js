const { createStore, combineReducers, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;

const initialState = {
  currentUser: 2,
  currentView: 'CALENDAR',
  calendar: {
    filter: 'UPCOMING',
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

const currentUser = (state = 2, action) => {
  switch (action.type) {
    case 'SWITCH_USER':
      return action.userId;
    default:
      return state;
  }
}

const currentView = (state = 'CALENDAR', action) => {
  switch (action.type) {
    case 'VIEW_CALENDAR':
    case 'TRIP_ADDED':
    case 'TRIP_MODIFIED':
      return 'CALENDAR';
    case 'VIEW_CREATE_TRIP':
      return 'CREATE_TRIP'
    case 'VIEW_MODIFY_TRIP':
      return 'MODIFY_TRIP'
    default:
      return state;
  }
}

const calendar = (state = initialState.calendar, action) => {
  switch (action.type) {
    case 'VIEW_CALENDAR':
    case 'TRIP_ADDED':
    case 'TRIP_MODIFIED':
      return Object.assign({}, state, {
        filter: action.filter
      })
    case 'LOAD_TRIPS':
      return Object.assign({}, state, {
        trips: [...action.trips]
      })
    case 'AUTOCOMPLETE_CREATED':
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
