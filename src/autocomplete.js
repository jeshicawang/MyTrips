/* global google */
const React = require('react');
const { connect } = require('react-redux');
const { autocompleteCreated } = require('./actions.js')

const Autocomplete = ({ saveAutocomplete }) => {

  const initAutocomplete = (element) => {
    if (!element) return;
    const newAutocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(element),
              {types: ['(cities)']}
    );
    newAutocomplete.index = 0;
    newAutocomplete.addListener('place_changed', () => location.hash = 'create-trip');
    saveAutocomplete(newAutocomplete)
  }

  return (
    <input placeholder='Where do you want to go?' ref={initAutocomplete} type='text'/>
  )

}

Autocomplete.propTypes = {
  saveAutocomplete: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  saveAutocomplete: (autocomplete) => dispatch(autocompleteCreated(autocomplete))
})

module.exports = connect(null, mapDispatchToProps)(Autocomplete);
