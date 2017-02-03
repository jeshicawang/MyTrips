const React = require('react');
const { connect } = require('react-redux');
const { fetchTrips } = require('./actions');

const HeaderLink = ({ children, filter, handleClick }) => {
  const className = (children === filter) ? 'filter focus' : 'filter';
  return (
    <a className={className} onClick={handleClick} href='#'>
      { children }
    </a>
  )
}

HeaderLink.propTypes = {
  children: React.PropTypes.string.isRequired,
  filter: React.PropTypes.string,
  handleClick: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ calendar }) => ({ filter: calendar.filter });

const mapDispatchToProps = (dispatch) => ({
  handleClick: ({target}) => dispatch(fetchTrips(target))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(HeaderLink);
