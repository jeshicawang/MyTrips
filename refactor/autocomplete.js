/* global google */
const React = require('react');
const { connect } = require('react-redux');

const Autocomplete = ({ autocompleteCreated }) => {

  const initAutocomplete = (element) => {
    if (!element) return;
    const newAutocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(element),
              {types: ['(cities)']}
    );
    newAutocomplete.index = 0;
    newAutocomplete.addListener('place_changed', () => location.hash = 'create-trip');
    autocompleteCreated(newAutocomplete)
  }

  return (
    <input placeholder='Where do you want to go?' ref={initAutocomplete} type='text'/>
  )

}

Autocomplete.propTypes = {
  autocompleteCreated: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  autocompleteCreated: (autocomplete) => dispatch({ type: 'AUTOCOMPLETE_CREATED', autocomplete })
})

module.exports = connect(null, mapDispatchToProps)(Autocomplete);
