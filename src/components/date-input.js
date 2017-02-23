const React = require('react');
const { connect } = require('react-redux')
const { updateFormInput } = require('../actions/action-creators.js')

const DateInput = ({ stateKey, value, handleChange }) => {
  return (
    <input
      className={stateKey}
      type='date'
      value={value || ''}
      onChange={handleChange}
      required
    />
  )
}

DateInput.propTypes = {
  stateKey: React.PropTypes.string,
  value: React.PropTypes.string,
  handleChange: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, { stateKey, index }) => ({
  handleChange: (event) => dispatch(updateFormInput('destinations', { index, key: stateKey, value: event.target.value }))
})

module.exports = connect(null, mapDispatchToProps)(DateInput);
