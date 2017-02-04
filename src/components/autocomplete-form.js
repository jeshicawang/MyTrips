const React = require('react');
const { connect } = require('react-redux');
const Autocomplete = require('./autocomplete.js');
const { updateDestinationInfo, formAutocompleteCreated, updateFormInput } = require('../actions/');

const AutocompleteForm = ({ value, autocomplete, handlePlaceChange, saveAutocomplete, handleChange }) => {
  return (
    <Autocomplete
      value={value}
      placeholder='Destination'
      autocomplete={autocomplete}
      saveAutocomplete={saveAutocomplete}
      handlePlaceChange={handlePlaceChange}
      handleChange={handleChange}
    />
  )
}

AutocompleteForm.propTypes = {
  value: React.PropTypes.string,
  autocomplete: React.PropTypes.object,
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, { index }) => ({
  handlePlaceChange: (autocomplete) => dispatch(updateDestinationInfo(index, autocomplete)),
  saveAutocomplete: (autocomplete) => dispatch(formAutocompleteCreated(autocomplete, index)),
  handleChange: (event) => dispatch(updateFormInput('destinations', { index, key: 'address', value: event.target.value }))
})

const mapStateToProps = ({ createTrip }, { index }) => ({ autocomplete: createTrip.autocompletes[index] })

module.exports = connect(mapStateToProps, mapDispatchToProps)(AutocompleteForm);
