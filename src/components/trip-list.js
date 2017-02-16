const React = require('react');
const { connect } = require('react-redux')
const Trip = require('./trip.js')

const TripList = ({ trips, dropdowns }) => {
  const tripElements = trips.map(({ id, title, description, start_date, end_date, photo_url }, index) => (
    <Trip
      key={id}
      dropdown={dropdowns[index]}
      title={title}
      description={description}
      start_date={start_date}
      end_date={end_date}
      photo_url={photo_url}/>
  ));
  return (
    <div id='trip-list'>
      { tripElements }
    </div>
  )
}

TripList.propTypes = {
  trips: React.PropTypes.arrayOf(React.PropTypes.object.isRequired),
  dropdowns: React.PropTypes.arrayOf(React.PropTypes.bool.isRequired)
}

const mapStateToProps = ({ calendar }) => ({
  trips: calendar.trips,
  dropdowns: calendar.dropdowns
});

module.exports = connect(mapStateToProps)(TripList);
