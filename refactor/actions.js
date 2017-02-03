const viewCalendar = () => ({ type: 'VIEW_CALENDAR' });

const changeFilter = (filter, trips) => ({ type: 'CHANGE_FILTER', filter, trips });

const fetchTrips = (target) => (dispatch, getState) => {
  const { classList, textContent: filter } = target ? target : { classList: null, textContent: 'UPCOMING' }
  const { currentUser } = getState();
  if (classList && classList.contains('focus')) return;
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === 'UPCOMING'))
    .then(results => results.json())
    .then(trips => dispatch(changeFilter(filter, trips)))
}

module.exports = { viewCalendar, fetchTrips }
