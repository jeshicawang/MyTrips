const React = require('react');
const { connect } = require('react-redux')
const { updateFormInput } = require('../actions/action-creators.js')

const TextInput = ({ value, placeholder, handleChange, required }) => {
  return (
    <input
      type='text'
      value={value || ''}
      placeholder={placeholder}
      onChange={handleChange}
      required={required}
    />
  )
}

TextInput.propTypes = {
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string.isRequired,
  handleChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool
}

const mapDispatchToProps = (dispatch, { stateKey }) => ({
  handleChange: (event) => dispatch(updateFormInput(stateKey, event.target.value))
})

module.exports = connect(null, mapDispatchToProps)(TextInput);
