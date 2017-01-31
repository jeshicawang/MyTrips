const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');
const { Provider } = require('react-redux');
const App = require('./app.js');

const loadUpcomingTrips = (dispatch, getState) => {
  const { currentUser, calendar } = getState();
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (calendar.filter === 'UPCOMING'))
    .then(results => results.json())
    .then(trips => dispatch({ type: 'LOAD_TRIPS', trips }))
}

store.dispatch(loadUpcomingTrips);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
