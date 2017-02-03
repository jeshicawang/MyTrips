const React = require('react');
const { connect } = require('react-redux');

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
  filter: React.PropTypes.string.isRequired,
  handleClick: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ calendar }) => ({ filter: calendar.filter });

const mapDispatchToProps = (dispatch) => ({
  handleClick: (event) => {
    if (event.target.classList.contains('focus')) return;
    dispatch(changeFilter)
  }
})

const changeFilter = (dispatch, getState) => {
  const { currentUser, calendar } = getState();
  const filter = (calendar.filter === 'UPCOMING') ? 'PAST' : 'UPCOMING';
  fetch('/trips?userId=' + currentUser + '&upcoming=' + (filter === 'UPCOMING'))
    .then(results => results.json())
    .then(trips => dispatch({ type: 'CHANGE_FILTER', filter, trips }))
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(HeaderLink);
