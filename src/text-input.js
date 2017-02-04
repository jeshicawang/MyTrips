const React = require('react');
const { connect } = require('react-redux')
const { updateFormInput } = require('./actions.js')

const TextInput = ({ value, placeholder, handleChange }) => {
  return (
    <input
      type='text'
      value={value || ''}
      placeholder={placeholder}
      onChange={handleChange}
      required
    />
  )
}

TextInput.propTypes = {
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string.isRequired,
  handleChange: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, { stateKey }) => ({
  handleChange: (event) => dispatch(updateFormInput(stateKey, event.target.value))
})

module.exports = connect(null, mapDispatchToProps)(TextInput);
