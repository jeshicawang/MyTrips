const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./store');

const App = ({ state }) => {
  return (
    <div>
      { JSON.stringify(state) }
    </div>
  );
}

App.propTypes = {
  state: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
}

const draw = () => {
  const state = store.getState();
  const { dispatch } = store;
  ReactDOM.render(<App state={state} dispatch={dispatch} />, document.getElementById('app'));
};

store.subscribe(draw);

draw();
