const React = require('react');
const { connect } = require('react-redux');
const { CALENDAR, CREATE_TRIP } = require('../actions/action-types.js');
const Calendar = require('./calendar.js');
const CreateTrip = require('./create-trip.js');

const App = ({ view }) => {
  return (
    <div>
      <h1>MyTrips</h1>
      { (view === CALENDAR) && <Calendar/> }
      { (view === CREATE_TRIP) && <CreateTrip/> }
    </div>
  );
}

App.propTypes = {
  view: React.PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  view: state.currentView
})

module.exports = connect(mapStateToProps)(App);
