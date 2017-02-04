/* global google */
const React = require('react');

const Autocomplete = ({ value, placeholder, autocomplete, handlePlaceChange, saveAutocomplete, handleChange }) => {

  const initAutocomplete = (element) => {
    if (!element || autocomplete) return;
    const newAutocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(element),
              {types: ['(cities)']}
    );
    newAutocomplete.index = 0;
    newAutocomplete.addListener('place_changed', () => handlePlaceChange(newAutocomplete));
    saveAutocomplete(newAutocomplete);
  }

  return (
    <input value={value} placeholder={placeholder} type='text' ref={initAutocomplete} onChange={handleChange}/>
  )

}

Autocomplete.propTypes = {
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string.isRequired,
  autocomplete: React.PropTypes.object,
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

module.exports = Autocomplete;
