const React = require('react');
const { connect } = require('react-redux');
const Header = require('./header.js');
const HeaderLink = require('./header-link.js');
const Content = require('./content.js');
const Autocomplete = require('./autocomplete.js');
const TripList = require('./trip-list.js');
const { fetchTripsIfNeeded } = require('./actions.js')

const Calendar = ({ tryFetch }) => {
  return (
    <div id='calendar' className='container shadow' ref={tryFetch}>
      <Header>
        <HeaderLink filter='UPCOMING'>upcoming</HeaderLink>
        <HeaderLink filter='PAST'>past</HeaderLink>
      </Header>
      <Content>
        <Autocomplete/>
        <TripList/>
      </Content>
    </div>
  )
}

Calendar.propTypes = {
  tryFetch: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  tryFetch: () => dispatch(fetchTripsIfNeeded())
})

module.exports = connect(null, mapDispatchToProps)(Calendar);
