const React = require('react');
const TextInput = require('./text-input.js');
const DestinationInput = require('./destination-input.js');

const TripForm = ({ info }) => {
  const { title, description, destinationCount, destinations, notes } = info;
  return (
    <form>
      <TextInput value={title} placeholder='Title' stateKey='title'/>
      <TextInput value={description} placeholder='Description' stateKey='description'/>
      { destinations.map((destination, index) => <DestinationInput key={index} id={index} info={destination}/>) }
      <a href='#'>+ add another destination</a>
      <TextInput value={notes} placeholder='Notes' stateKey='notes'/>
      <input type='submit' value='Done'/>
    </form>
  )
}

TripForm.propTypes = {
  info: React.PropTypes.object.isRequired
}

module.exports = TripForm;
