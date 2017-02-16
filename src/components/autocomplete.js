/* global google */
const React = require('react');

const Autocomplete = ({ index, value, placeholder, autocomplete, handlePlaceChange, saveAutocomplete, handleChange }) => {

  const initAutocomplete = (element) => {
    // return if the input is merely being updated and an autocomplete already exists
    if (autocomplete || !element) return;

    // Removing google generated .pac-container if necessary
    const containerIndex = index ? index : 0
    const container = document.getElementsByClassName('pac-container')[containerIndex];
    if (container)
      container.parentElement.removeChild(container);

    // Creating a new google autocomplete object
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
  index: React.PropTypes.number,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string.isRequired,
  autocomplete: React.PropTypes.object,
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

module.exports = Autocomplete;
