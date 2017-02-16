const React = require('react');
const { connect } = require('react-redux');
const AutocompleteForm = require('./autocomplete-form.js');
const DateInput = require('./date-input.js')
const { showRemoveButton, hideRemoveButton, removeDestination } = require('../actions/action-creators.js');

const DestinationInput = ({ id, handleMouseMove, handleMouseLeave, removeButton, handleClick, info }) => {
  const { address, start_date, end_date } = info;
  return (
    <div className='destination' id={id} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      { removeButton && <a href='#' className='remove' onClick={handleClick}>X</a> }
      <h4>Destination</h4>
      <AutocompleteForm value={address} index={id}/>
      <div className='dates'>
        <DateInput value={start_date} stateKey='start_date' index={id}/>
        <DateInput value={end_date} stateKey='end_date' index={id}/>
      </div>
    </div>
  )
}

DestinationInput.propTypes = {
  id: React.PropTypes.number.isRequired,
  handleMouseMove: React.PropTypes.func.isRequired,
  handleMouseLeave: React.PropTypes.func.isRequired,
  removeButton: React.PropTypes.bool.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  info: React.PropTypes.object.isRequired
}

const mapStateToProps = ({ createTrip }, { id }) => ({
  removeButton: createTrip.removeButtons.length > 1 && createTrip.removeButtons[id]
})

const mapDispatchToProps = (dispatch, { id }) => ({
  handleMouseMove: () => dispatch(showRemoveButton(id)),
  handleMouseLeave: () => dispatch(hideRemoveButton(id)),
  handleClick: () => dispatch(removeDestination(id))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(DestinationInput);
