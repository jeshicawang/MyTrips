const React = require('react');

const Trip = ({ dropdown, title, description, start_date, end_date, photo_url }) => {
  const addPhoto = (element) => {
    if (!element) return;
    element.style.backgroundImage = 'url(' + photo_url + ')';
  }
  return (
    <div className='trip' ref={addPhoto}><div className='layer'>
      <span className='dropdown lnr lnr-chevron-down'/>
      <Dropdown dropdown={dropdown}/>
      <h3>{ title }</h3>
      <p>{ description }</p>
      <p>{ start_date } - { end_date }</p>
    </div></div>
  )
}

Trip.propTypes = {
  dropdown: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start_date: React.PropTypes.string.isRequired,
  end_date: React.PropTypes.string.isRequired,
  photo_url: React.PropTypes.string.isRequired
}

const Dropdown = ({ dropdown }) => {
  return (
    <div className={ dropdown ? 'dropdown shadow' : 'hidden dropdown shadow' }>
      <a href="#">Modify Trip</a>
      <a href="#">Delete Trip</a>
    </div>
  )
}

Dropdown.propTypes = {
  dropdown: React.PropTypes.bool.isRequired
}

module.exports = Trip;
