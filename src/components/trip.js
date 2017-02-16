const React = require('react');
const { connect } = require('react-redux');
const { toggleDropdown } = require('../actions/action-creators.js')

const Trip = ({ handleClick, dropdown, title, description, start_date, end_date, photo_url }) => {
  const addPhoto = (element) => {
    if (!element) return;
    element.style.backgroundImage = 'url(' + photo_url + ')';
  }
  return (
    <div className='trip' ref={addPhoto}><div className='layer'>
      <span className='dropdown lnr lnr-chevron-down' onClick={handleClick}/>
      { dropdown && <Dropdown/> }
      <h3>{ title }</h3>
      <p>{ description }</p>
      <p>{ start_date } - { end_date }</p>
    </div></div>
  )
}

Trip.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  dropdown: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start_date: React.PropTypes.string.isRequired,
  end_date: React.PropTypes.string.isRequired,
  photo_url: React.PropTypes.string.isRequired
}

const Dropdown = () => {
  return (
    <div className='dropdown shadow'>
      <a href="#">Modify Trip</a>
      <a href="#">Delete Trip</a>
    </div>
  )
}

const mapStateToProps = ({ calendar }, { index }) => ({ dropdown: calendar.dropdowns[index] })

const mapDispatchToProps = (dispatch, { index }) => ({
  handleClick: (event) => {
    event.stopPropagation();
    dispatch(toggleDropdown(index))
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(Trip);
