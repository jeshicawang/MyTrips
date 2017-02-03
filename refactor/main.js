const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');
const { Provider } = require('react-redux');
const App = require('./app.js');

const renderDOM = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('app')
  );
}

const viewCalendar = (dispatch) => {
  fetch('/trips?userId=2&upcoming=true')
    .then(results => results.json())
    .then(trips => dispatch({ type: 'VIEW_CALENDAR', filter: 'UPCOMING', trips }))
    .then(() => renderDOM())
}

store.dispatch(viewCalendar)
