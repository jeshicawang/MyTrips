const React = require('react');
const { connect } = require('react-redux');
const { fetchTripsIfNeeded } = require('../actions/');

const HeaderLink = ({ children, focus, handleClick }) => {
  const className = focus ? 'filter focus' : 'filter';
  return (
    <a className={className} onClick={handleClick} href='#'>
      { children }
    </a>
  )
}

HeaderLink.propTypes = {
  children: React.PropTypes.string.isRequired,
  focus: React.PropTypes.bool.isRequired,
  handleClick: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ calendar }, { filter }) => ({
  focus: calendar.filter === filter
});

const mapDispatchToProps = (dispatch, { filter, focus }) => ({
  handleClick: () => dispatch(fetchTripsIfNeeded(filter, focus))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(HeaderLink);
