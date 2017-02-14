const React = require('react');
const { connect } = require('react-redux');
const Autocomplete = require('./autocomplete.js');
const { viewChanged, tripInfoUpdated, autocompleteCreated, updateCalendarInput } = require('../actions/action-creators.js');
const { CALENDAR, CREATE_TRIP } = require('../constants/views.js');

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
  saveAutocomplete: (autocomplete) => dispatch(autocompleteCreated(CALENDAR, autocomplete)),
  handleChange: (event) => dispatch(updateCalendarInput(event.target.value))
})

const loadCreateTripFormInfo = (autocomplete) => (dispatch) => {
  const { name, formatted_address, place_id, photos } = autocomplete.getPlace();
  const title = name + ' Trip';
  const destination = {
    address: formatted_address,
    location: name,
    place_id,
    photo_url: photos[0].getUrl({'maxWidth': 1600}),
    start_date: null,
    end_date: null
  };
  const tripInfo = { title, destination };
  dispatch(viewChanged(CREATE_TRIP));
  dispatch(tripInfoUpdated(CREATE_TRIP, tripInfo));
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AutocompleteMain);
