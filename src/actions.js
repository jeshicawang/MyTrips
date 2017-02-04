const DEFAULTS = { USER: 2, VIEW: 'CALENDAR', FILTER: 'UPCOMING' }
const VIEW_CALENDAR = 'VIEW_CALENDAR';
const CALENDAR = 'CALENDAR';
const UPCOMING = 'UPCOMING';
const PAST = 'PAST';
const MAIN_AUTOCOMPLETE_CREATED = 'AUTOCOMPLETE_CREATED';
const FORM_AUTOCOMPLETE_CREATED = 'FORM_AUTOCOMPLETE_CREATED';
const UPDATE_CALENDAR_INPUT = 'UPDATE_CALENDAR_INPUT';
const VIEW_CREATE_TRIP = 'VIEW_CREATE_TRIP';
const CREATE_TRIP = 'CREATE_TRIP';
const MODIFY_TRIP = 'MODIFY_TRIP';
const UPDATE_CREATE_TRIP_INPUT = 'UPDATE_CREATE_TRIP_INPUT';
const CREATE_TRIP_DESTINATION_INPUT = 'CREATE_TRIP_DESTINATION_INPUT'
const UPDATE_MODIFY_TRIP_INPUT = 'UPDATE_MODIFY_TRIP_INPUT'
const CHANGE_FILTER = 'CHANGE_FILTER';

const viewCalendar = () => ({ type: VIEW_CALENDAR });

const mainAutocompleteCreated = (autocomplete) => ({ type: MAIN_AUTOCOMPLETE_CREATED, autocomplete });

const formAutocompleteCreated = (autocomplete, index) => ({ type: FORM_AUTOCOMPLETE_CREATED, autocomplete, index });

const updateCalendarInput = (value) => ({ type: UPDATE_CALENDAR_INPUT, value });

const updateCreateTripInput = (key, value) => ({ type: UPDATE_CREATE_TRIP_INPUT, key, value });

const createTripDestinationInput = (index, value) => ({ type: CREATE_TRIP_DESTINATION_INPUT, index, value });

const updateModifyTripInput = (key, value) => ({ type: UPDATE_MODIFY_TRIP_INPUT, key, value });

const viewCreateTrip = ({ title, destination }) => ({ type: VIEW_CREATE_TRIP, title, destination });

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
  dispatch(viewCreateTrip(tripInfo))
}

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
  }
  else if (getState().currentView === CREATE_TRIP) {
    dispatch(updateCreateTripInput(key, val));
  }
  else if (getState().currentView === MODIFY_TRIP) {
    dispatch(updateModifyTripInput(key, val));
  }
}

const changeFilter = (filter, trips) => ({ type: CHANGE_FILTER, filter, trips });

const fetchTrips = (filter) => (dispatch, getState) => {
  const { currentUser } = getState();
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === DEFAULTS.FILTER))
    .then(results => results.json())
    .then(trips => dispatch(changeFilter(filter, trips)))
}

const fetchTripsIfNeeded = (filter, focus) => (dispatch) => {
  if (focus) return;
  dispatch(fetchTrips(filter ? filter : DEFAULTS.FILTER));
}

module.exports = {
  DEFAULTS,
  VIEW_CALENDAR,
  CALENDAR,
  UPCOMING,
  PAST,
  MAIN_AUTOCOMPLETE_CREATED,
  FORM_AUTOCOMPLETE_CREATED,
  UPDATE_CALENDAR_INPUT,
  VIEW_CREATE_TRIP,
  CREATE_TRIP,
  UPDATE_CREATE_TRIP_INPUT,
  CREATE_TRIP_DESTINATION_INPUT,
  UPDATE_MODIFY_TRIP_INPUT,
  CHANGE_FILTER,
  viewCalendar,
  formAutocompleteCreated,
  mainAutocompleteCreated,
  updateCalendarInput,
  loadCreateTripFormInfo,
  updateFormInput,
  updateDestinationInfo,
  fetchTripsIfNeeded
}
