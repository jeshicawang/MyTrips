const React = require('react');
const { connect } = require('react-redux');
const { modifyTrip, deleteTrip } = require('../actions/action-creators.js')

const Dropdown = ({ handleModifyClick, handleDeleteClick }) => {
  return (
    <div className='dropdown shadow'>
      <a onClick={handleModifyClick} href="#">Modify Trip</a>
      <a onClick={handleDeleteClick} href="#">Delete Trip</a>
    </div>
  )
}

Dropdown.propTypes = {
  handleModifyClick: React.PropTypes.func.isRequired,
  handleDeleteClick: React.PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, { id }) => ({
  handleModifyClick: () => dispatch(modifyTrip(id)),
  handleDeleteClick: () => dispatch(deleteTrip(id))
})

module.exports = connect(null, mapDispatchToProps)(Dropdown);
