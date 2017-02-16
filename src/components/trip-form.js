const React = require('react');
const { connect } = require('react-redux');
const TextInput = require('./text-input.js');
const DestinationInput = require('./destination-input.js');
const { destinationAdded } = require('../actions/action-creators.js');

const TripForm = ({ handleSubmit, info, handleClick }) => {
  const { title, description, destinations, notes } = info;
  return (
    <form onSubmit={handleSubmit}>
      <TextInput value={title} placeholder='Title' stateKey='title' required={true}/>
      <TextInput value={description} placeholder='Description' stateKey='description'/>
      { destinations.map((destination, index) => <DestinationInput key={index} id={index} info={destination}/>) }
      <a href='#' onClick={handleClick}>+ add another destination</a>
      <TextInput value={notes} placeholder='Notes' stateKey='notes'/>
      <input type='submit' value='Done'/>
    </form>
  )
}

TripForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  info: React.PropTypes.object.isRequired,
  handleClick: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, { view }) => ({
  handleClick: () => dispatch(destinationAdded(view))
})

module.exports = connect(null, mapDispatchToProps)(TripForm);
