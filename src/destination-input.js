const React = require('react');
const AutocompleteForm = require('./autocomplete-form.js');

const DestinationInput = ({ id, info }) => {
  const { address, location, start_date, end_date } = info;
  return (
    <div id={id}>
      <h4>Destination</h4>
      <AutocompleteForm value={address} index={id}/>
      <div>
        <input/>
        <input/>
      </div>
    </div>
  )
}

DestinationInput.propTypes = {
  info: React.PropTypes.object.isRequired
}

module.exports = DestinationInput;
