const React = require('react');
const { connect } = require('react-redux');

const TripList = ({ trips }) => {
  const tripElements = trips.map(({ id, title, description, start_date, end_date, photo_url }) => (
    <Trip key={id} title={title} description={description} start_date={start_date} end_date={end_date} photo_url={photo_url}/>
  ));
  return (
    <div id='trip-list'>
      { tripElements }
    </div>
  )
}

TripList.propTypes = {
  trips: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)
}

const Trip = ({ title, description, start_date, end_date, photo_url }) => {
  const addPhoto = (element) => {
    if (!element) return;
    element.style.backgroundImage = 'url(' + photo_url + ')';
  }
  return (
    <div className='trip' ref={addPhoto}><div className='layer'>
      <h3>{ title }</h3>
      <p>{ description }</p>
      <p>{ start_date } - { end_date }</p>
    </div></div>
  )
}

Trip.propTypes = {
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start_date: React.PropTypes.string.isRequired,
  end_date: React.PropTypes.string.isRequired,
  photo_url: React.PropTypes.string.isRequired
}

const mapStateToProps = ({ calendar }) => ({ trips: calendar.trips })

module.exports = connect(mapStateToProps)(TripList);
