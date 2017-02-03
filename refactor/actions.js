const viewCalendar = () => ({ type: 'VIEW_CALENDAR' });

const changeFilter = (filter, trips) => ({ type: 'CHANGE_FILTER', filter, trips });

const fetchTrips = (filter) => (dispatch, getState) => {
  const { currentUser } = getState();
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === 'UPCOMING'))
    .then(results => results.json())
    .then(trips => dispatch(changeFilter(filter, trips)))
}

const fetchTripsIfNeeded = (filter, focus) => (dispatch) => {
  if (focus) return;
  dispatch(fetchTrips(filter ? filter : 'UPCOMING'));
}

const autocompleteCreated = (autocomplete) => ({ type: 'AUTOCOMPLETE_CREATED', autocomplete });

module.exports = { viewCalendar, fetchTripsIfNeeded, autocompleteCreated }
