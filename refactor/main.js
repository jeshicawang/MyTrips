const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');
const { Provider } = require('react-redux');
const App = require('./app.js');

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
