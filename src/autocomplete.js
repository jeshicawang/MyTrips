/* global google */
const React = require('react');
const { connect } = require('react-redux');
const { loadCreateTripFormInfo, autocompleteCreated, updateCalendarInput } = require('./actions.js')

const Autocomplete = ({ handlePlaceChange, saveAutocomplete, handleChange }) => {

  const initAutocomplete = (element) => {
    if (!element) return;
    const newAutocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(element),
              {types: ['(cities)']}
    );
    newAutocomplete.index = 0;
    newAutocomplete.addListener('place_changed', () => handlePlaceChange(newAutocomplete));
    saveAutocomplete(newAutocomplete)
  }

  return (
    <input placeholder='Where do you want to go?' type='text' ref={initAutocomplete} onChange={handleChange}/>
  )

}

Autocomplete.propTypes = {
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  handlePlaceChange: (autocomplete) => dispatch(loadCreateTripFormInfo(autocomplete)),
  saveAutocomplete: (autocomplete) => dispatch(autocompleteCreated(autocomplete)),
  handleChange: (event) => dispatch(updateCalendarInput(event.target.value))
})

module.exports = connect(null, mapDispatchToProps)(Autocomplete);
