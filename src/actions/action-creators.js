const DEFAULTS = require('../constants/defaults.js');
const { CREATE_TRIP, UPCOMING } = require('../constants/views.js')
const {
  VIEW_CHANGED,
  TRIP_FORM_LOADED,
  AUTOCOMPLETE_CREATED,
  MAIN_AUTOCOMPLETE_UPDATED,
  DESTINATION_INPUT_UPDATED,
  INPUT_UPDATED,
  DESTINATION_ADDED,
  FILTER_CHANGED,
  TRIPS_FETCHED,
  TRIP_ADDED
} = require('../constants/action-types.js');

const viewChanged = (view) => ({ type: VIEW_CHANGED, view });

const autocompleteCreated = (view, autocomplete) => ({ type: AUTOCOMPLETE_CREATED, view, autocomplete })

const mainAutocompleteUpdated = (value) => ({ type: MAIN_AUTOCOMPLETE_UPDATED, value });

const destinationAdded = (view) => ({ type: DESTINATION_ADDED, view });

const tripFormLoaded = (view, tripInfo) => ({ type: TRIP_FORM_LOADED, view, tripInfo });

const loadCreateTripFormInfo = (autocomplete) => (dispatch) => {
  const { name, formatted_address, place_id, photos } = autocomplete.getPlace();
  const title = name + ' Trip';
  const destination = {
    address: formatted_address,
    location: name,
    place_id,
    photo_url: photos[0].getUrl({'maxWidth': 1600}),
    start_date: null,
    end_date: null
  };
  const tripInfo = { title, destination };
  dispatch(viewChanged(CREATE_TRIP));
  dispatch(tripFormLoaded(CREATE_TRIP, tripInfo));
}

const destinationInputUpdated = (view, index, value) => ({ type: DESTINATION_INPUT_UPDATED, view, index, value });

const updateDestinationInfo = (index, autocomplete) => (dispatch, getState) => {
  const { name, formatted_address, place_id, photos } = autocomplete.getPlace();
  const value = {
    address: formatted_address,
    location: name,
    place_id,
    photo_url: photos[0].getUrl({'maxWidth': 1600})
  };
  dispatch(destinationInputUpdated(getState().currentView, index, value));
}

const inputUpdated = (view, key, value) => ({ type: INPUT_UPDATED, view, key, value });

const updateFormInput = (key, val) => (dispatch, getState) => {
  if (getState().currentView === CREATE_TRIP  && key === 'destinations') {
    const { index, key , value } = val;
    dispatch(destinationInputUpdated(getState().currentView, index, { [key]: value }));
  } else
    dispatch(inputUpdated(getState().currentView, key, val))
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

const fetchTripsIfNeeded = (filter, focus) => (dispatch, getState) => {
  if (focus) return;
  dispatch(fetchTrips(filter ? filter : getState().calendar.filter ? getState().calendar.filter : DEFAULTS.FILTER));
}

const tripAdded = () => ({ type: TRIP_ADDED });

const addTrip = () => (dispatch, getState) => {
  const { currentUser, createTrip } = getState();
  const { title, description, destinations, notes } = createTrip;
  const dates = destinations.reduce((dates, destination) => {
    dates.push(destination.start_date);
    dates.push(destination.end_date);
    return dates;
  }, []).sort();
  const body = {
    title,
    description,
    start_date: dates[0],
    end_date: dates[dates.length-1],
    destinations,
    notes
  }
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/trips?userId=' + currentUser, options).then(() => {
    dispatch(tripAdded());
  });
}

module.exports = {
  viewChanged,
  autocompleteCreated,
  mainAutocompleteUpdated,
  loadCreateTripFormInfo,
  tripFormLoaded,
  updateFormInput,
  destinationAdded,
  updateDestinationInfo,
  fetchTripsIfNeeded,
  addTrip
}
