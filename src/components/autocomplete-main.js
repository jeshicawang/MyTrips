const React = require('react');
const { connect } = require('react-redux');
const Autocomplete = require('./autocomplete.js');
const { loadCreateTripFormInfo, mainAutocompleteCreated, updateCalendarInput } = require('../actions/');

const AutocompleteMain = ({ input, autocomplete, handlePlaceChange, saveAutocomplete, handleChange }) => {
  return (
    <Autocomplete
      value={input}
      placeholder='Where do you want to go?'
      autocomplete={autocomplete}
      handlePlaceChange={handlePlaceChange}
      saveAutocomplete={saveAutocomplete}
      handleChange={handleChange}
    />
  )
}

AutocompleteMain.propTypes = {
  input: React.PropTypes.string.isRequired,
  autocomplete: React.PropTypes.object,
  handlePlaceChange: React.PropTypes.func.isRequired,
  saveAutocomplete: React.PropTypes.func.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

const mapStateToProps = ({calendar}) => ({
  input: calendar.input,
  autocomplete: calendar.autocomplete
})

const mapDispatchToProps = (dispatch) => ({
  handlePlaceChange: (autocomplete) => dispatch(loadCreateTripFormInfo(autocomplete)),
  saveAutocomplete: (autocomplete) => dispatch(mainAutocompleteCreated(autocomplete)),
  handleChange: (event) => dispatch(updateCalendarInput(event.target.value))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(AutocompleteMain);
