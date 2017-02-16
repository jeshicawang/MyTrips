const DEFAULTS = require('../constants/defaults.js');
const { CREATE_TRIP, MODIFY_TRIP, UPCOMING } = require('../constants/views.js')
const {
  VIEW_CHANGED,
  TRIP_FORM_LOADED,
  AUTOCOMPLETE_CREATED,
  MAIN_AUTOCOMPLETE_UPDATED,
  DESTINATION_INPUT_UPDATED,
  INPUT_UPDATED,
  DESTINATION_ADDED,
  DESTINATION_REMOVED,
  REMOVE_BUTTON_TOGGLED,
  FILTER_CHANGED,
  TRIPS_FETCHED,
  DROPDOWN_TOGGLED,
  TRIP_ADDED
} = require('../constants/action-types.js');
const moment = require('moment');

const viewChanged = (view) => ({ type: VIEW_CHANGED, view });

const autocompleteCreated = (view, autocomplete) => ({ type: AUTOCOMPLETE_CREATED, view, autocomplete })

const mainAutocompleteUpdated = (value) => ({ type: MAIN_AUTOCOMPLETE_UPDATED, value });

const destinationAdded = (view) => ({ type: DESTINATION_ADDED, view });

const removeButtonToggled = (view, index, bool) => ({ type: REMOVE_BUTTON_TOGGLED, view, index, bool })

const showRemoveButton = (index) => (dispatch, getState) => {
  dispatch(removeButtonToggled(getState().currentView, index, true))
}

const hideRemoveButton = (index) => (dispatch, getState) => {
  dispatch(removeButtonToggled(getState().currentView, index, false))
}

const destinationRemoved = (view, index) => ({ type: DESTINATION_REMOVED, view, index })

const removeDestination = (index) => (dispatch, getState) => {
  dispatch(destinationRemoved(getState().currentView, index));
}

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

const modifyTrip = (id) => (dispatch) => {
  fetch('/trips/' + id)
    .then(result => result.json())
    .then(results => {
      const [{ title, description, notes }] = results;
      const destinations = results.map(({ address, location, place_id, photo_url, start_date, end_date }) =>
        ({ address, location, place_id, photo_url, start_date, end_date })
      );
      const tripInfo = { title, description, notes, destinations };
      dispatch(viewChanged(MODIFY_TRIP));
      dispatch(tripFormLoaded(MODIFY_TRIP, tripInfo))
    })
    .catch(error => console.error(error));
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
  const view = getState().currentView;
  if (key === 'destinations') {
    const { index, key , value } = val;
    dispatch(destinationInputUpdated(view, index, { [key]: value }));
  } else
    dispatch(inputUpdated(view, key, val))
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

const dropdownToggled = (index) => ({ type: DROPDOWN_TOGGLED, index })

const toggleDropdown = (index) => (dispatch, getState) => {
  const otherIndex = getState().calendar.dropdowns.findIndex(d => d);
  if (otherIndex !== index && otherIndex !== -1) dispatch(dropdownToggled(otherIndex));
  dispatch(dropdownToggled(index));
}

const hideDropdown = () => (dispatch, getState) => {
  const index = getState().calendar.dropdowns.findIndex(d => d);
  if (index === -1) return;
  dispatch(toggleDropdown(index));
}

const tripAdded = (filter) => ({ type: TRIP_ADDED, filter });

const addTrip = () => (dispatch, getState) => {
  const { currentUser, createTrip } = getState();
  const { title, description, destinations, notes } = createTrip;
  const dates = destinations.reduce((dates, destination) => {
    dates.push(destination.start_date);
    dates.push(destination.end_date);
    return dates;
  }, []).sort();
  const start_date = dates[0];
  const end_date = dates[dates.length-1];
  const body = { title, description, start_date, end_date, destinations, notes };
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  fetch('/trips?userId=' + currentUser, options).then(() => {
    const filter = moment().isSameOrBefore(moment(end_date).add(1, 'd')) ? 'UPCOMING' : 'PAST';
    dispatch(tripAdded(filter));
  });
}

const submitModifyTrip = () => (dispatch, getState) => {

}

const deleteTrip = (id) => (dispatch, getState) => {
  const options = { method: 'DELETE' };
  fetch('/trips/' + id, options).then(() => {
    dispatch(fetchTrips(getState().calendar.filter));
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
  removeDestination,
  showRemoveButton,
  hideRemoveButton,
  updateDestinationInfo,
  fetchTripsIfNeeded,
  toggleDropdown,
  hideDropdown,
  addTrip,
  submitModifyTrip,
  modifyTrip,
  deleteTrip
}
