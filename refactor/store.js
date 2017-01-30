const Redux = require('redux');

const initialState = {
  currentView: 'CALENDAR',
  calendar: {
    filter: 'UPCOMING',
    trips: []
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

const reducer = Redux.combineReducers({ currentView, calendar, createTrip, modifyTrip });

const store = Redux.createStore(reducer, initialState);

module.exports = store;
