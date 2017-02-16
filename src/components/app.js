const React = require('react');
const { connect } = require('react-redux');
const { CALENDAR, CREATE_TRIP, MODIFY_TRIP } = require('../constants/views.js');
const Calendar = require('./calendar.js');
const CreateTrip = require('./create-trip.js');
const ModifyTrip = require('./modify-trip.js');

const App = ({ view }) => {
  return (
    <div>
      <h1>MyTrips</h1>
      { (view === CALENDAR) && <Calendar/> }
      { (view === CREATE_TRIP) && <CreateTrip/> }
      { (view === MODIFY_TRIP) && <ModifyTrip/> }
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
