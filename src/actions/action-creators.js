const DEFAULTS = require('../constants/defaults.js');
const { CREATE_TRIP, UPCOMING } = require('../constants/views.js')
const {
  VIEW_CHANGED,
  TRIP_INFO_UPDATED,
  AUTOCOMPLETE_CREATED,
  UPDATE_CALENDAR_INPUT,
  CREATE_TRIP_DESTINATION_INPUT,
  TRIP_FORM_INPUT_UPDATED,
  DESTINATION_ADDED,
  FILTER_CHANGED,
  TRIPS_FETCHED
} = require('../constants/action-types.js');

const viewChanged = (view) => ({ type: VIEW_CHANGED, view });

const autocompleteCreated = (view, autocomplete) => ({ type: AUTOCOMPLETE_CREATED, view, autocomplete })

const updateCalendarInput = (value) => ({ type: UPDATE_CALENDAR_INPUT, value });

const tripFormInputUpdated = (view, key, value) => ({ type: TRIP_FORM_INPUT_UPDATED, view, key, value });

const createTripDestinationInput = (index, value) => ({ type: CREATE_TRIP_DESTINATION_INPUT, index, value });

const destinationAdded = (view) => ({ type: DESTINATION_ADDED, view });

const tripInfoUpdated = (view, tripInfo) => ({ type: TRIP_INFO_UPDATED, view, tripInfo });

const updateDestinationInfo = (index, autocomplete) => (dispatch) => {
  const { name, formatted_address, place_id, photos } = autocomplete.getPlace();
  const value = {
    address: formatted_address,
    location: name,
    place_id,
    photo_url: photos[0].getUrl({'maxWidth': 1600})
  };
  dispatch(createTripDestinationInput(index, value));
}

const updateFormInput = (key, val) => (dispatch, getState) => {
  if (getState().currentView === CREATE_TRIP  && key === 'destinations') {
    const { index, key , value } = val;
    dispatch(createTripDestinationInput(index, { [key]: value }));
  } else {
    dispatch(tripFormInputUpdated(getState().currentView, key, val))
  }
}

const filterChanged = (filter) => ({ type: FILTER_CHANGED, filter });
const tripsFetched = (trips) => ({ type: TRIPS_FETCHED, trips });

const fetchTrips = (filter) => (dispatch, getState) => {
  dispatch(filterChanged(filter));
  const { currentUser } = getState();
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === UPCOMING))
    .then(results => results.json())
    .then(trips => dispatch(tripsFetched(trips)))
}

const fetchTripsIfNeeded = (filter, focus) => (dispatch) => {
  if (focus) return;
  dispatch(fetchTrips(filter ? filter : DEFAULTS.FILTER));
}

module.exports = {
  viewChanged,
  autocompleteCreated,
  updateCalendarInput,
  tripInfoUpdated,
  updateFormInput,
  destinationAdded,
  updateDestinationInfo,
  fetchTripsIfNeeded
}
