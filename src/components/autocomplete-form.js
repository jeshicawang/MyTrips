const React = require('react');
const { connect } = require('react-redux');
const Autocomplete = require('./autocomplete.js');
const { updateDestinationInfo, autocompleteCreated, updateFormInput } = require('../actions/action-creators.js');

const AutocompleteForm = ({ index, value, autocomplete, handlePlaceChange, saveAutocomplete, handleChange }) => {
  return (
    <Autocomplete
      index={index}
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
  index: React.PropTypes.number.isRequired,
  value: React.PropTypes.string,
  autocomplete: React.PropTypes.object,
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ currentView, createTrip }, { index }) => ({
  currentView,
  autocomplete: createTrip.autocompletes[index]
})

const mapDispatchToProps = (dispatch, { currentView, index }) => ({
  handlePlaceChange: (autocomplete) => dispatch(updateDestinationInfo(index, autocomplete)),
  saveAutocomplete: (autocomplete) => dispatch(autocompleteCreated(currentView, autocomplete)),
  handleChange: (event) => dispatch(updateFormInput('destinations', { index, key: 'address', value: event.target.value }))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(AutocompleteForm);
