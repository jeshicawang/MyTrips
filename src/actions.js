const DEFAULTS = { USER: 2, VIEW: 'CALENDAR', FILTER: 'UPCOMING' }
const VIEW_CALENDAR = 'VIEW_CALENDAR';
const CALENDAR = 'CALENDAR';
const UPCOMING = 'UPCOMING';
const PAST = 'PAST';
const UPDATE_CALENDAR_INPUT = 'UPDATE_CALENDAR_INPUT';
const VIEW_CREATE_TRIP = 'VIEW_CREATE_TRIP';
const CREATE_TRIP = 'CREATE_TRIP';
const CHANGE_FILTER = 'CHANGE_FILTER';
const AUTOCOMPLETE_CREATED = 'AUTOCOMPLETE_CREATED';

const viewCalendar = () => ({ type: VIEW_CALENDAR });

const updateCalendarInput = (value) => ({ type: UPDATE_CALENDAR_INPUT, value });

const viewCreateTrip = (tripInfo) => (Object.assign({ type: VIEW_CREATE_TRIP }, tripInfo))

const loadCreateTripFormInfo = (autocomplete) => (dispatch) => {
  const { name, formatted_address, place_id, photos } = autocomplete.getPlace();
  const title = name + ' Trip';
  const destinations = [{
    address: formatted_address,
    location: name,
    place_id,
    photo_url: photos[0].getUrl({'maxWidth': 1600}),
    start_date: null,
    end_date: null
  }];
  const tripInfo = { title, description: null, destinationCount: 1, destinations, notes: null };
  dispatch(viewCreateTrip(tripInfo))
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

const autocompleteCreated = (autocomplete) => ({ type: AUTOCOMPLETE_CREATED, autocomplete });

module.exports = {
  DEFAULTS,
  VIEW_CALENDAR,
  CALENDAR,
  UPCOMING,
  PAST,
  UPDATE_CALENDAR_INPUT,
  VIEW_CREATE_TRIP,
  CREATE_TRIP,
  CHANGE_FILTER,
  AUTOCOMPLETE_CREATED,
  viewCalendar,
  updateCalendarInput,
  loadCreateTripFormInfo,
  fetchTripsIfNeeded,
  autocompleteCreated,
}
