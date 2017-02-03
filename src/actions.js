const DEFAULT_USER = 2;
const DEFAULT_VIEW = 'CALENDAR';
const DEFAULT_FILTER = 'UPCOMING';

const UPCOMING = 'UPCOMING';
const PAST = 'PAST';
const VIEW_CALENDAR = 'VIEW_CALENDAR';
const CHANGE_FILTER = 'CHANGE_FILTER';
const AUTOCOMPLETE_CREATED = 'AUTOCOMPLETE_CREATED';

const viewCalendar = () => ({ type: VIEW_CALENDAR });

const changeFilter = (filter, trips) => ({ type: CHANGE_FILTER, filter, trips });

const fetchTrips = (filter) => (dispatch, getState) => {
  const { currentUser } = getState();
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === DEFAULT_FILTER))
    .then(results => results.json())
    .then(trips => dispatch(changeFilter(filter, trips)))
}

const fetchTripsIfNeeded = (filter, focus) => (dispatch) => {
  if (focus) return;
  dispatch(fetchTrips(filter ? filter : DEFAULT_FILTER));
}

const autocompleteCreated = (autocomplete) => ({ type: AUTOCOMPLETE_CREATED, autocomplete });

module.exports = {
  viewCalendar,
  fetchTripsIfNeeded,
  autocompleteCreated,
  DEFAULT_USER,
  DEFAULT_VIEW,
  DEFAULT_FILTER,
  UPCOMING,
  PAST,
  VIEW_CALENDAR,
  CHANGE_FILTER,
  AUTOCOMPLETE_CREATED
}
