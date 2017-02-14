const React = require('react');
const AutocompleteForm = require('./autocomplete-form.js');
const DateInput = require('./date-input.js')

const DestinationInput = ({ id, info }) => {
  const { address, start_date, end_date } = info;
  return (
    <div id={id}>
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
  info: React.PropTypes.object.isRequired
}

module.exports = DestinationInput;
