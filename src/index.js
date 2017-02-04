const React = require('react');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const ReactDOM = require('react-dom');
const rootReducer = require('./reducers/');
const { Provider } = require('react-redux');
const App = require('./components/app.js');

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
