const React = require('react');
const { connect } = require('react-redux')
const Trip = require('./trip.js')
const { hideDropdown } = require('../actions/action-creators.js')

const TripList = ({ trips, handleClick }) => {

  const toggleWindowListener = (element) => {
    if (element) window.addEventListener('click', handleClick);
    else window.removeEventListener('click', handleClick);
  }

  const tripElements = trips.map(({ id, title, description, start_date, end_date, photo_url }, index) => (
    <Trip
      key={id}
      index={index}
      title={title}
      description={description}
      start_date={start_date}
      end_date={end_date}
      photo_url={photo_url}/>
  ));

  return (
    <div id='trip-list' ref={toggleWindowListener}>
      { tripElements }
    </div>
  )

}

TripList.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  trips: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)
}

const mapStateToProps = ({ calendar }) => ({ trips: calendar.trips });

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => dispatch(hideDropdown())
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(TripList);
