const React = require('react');
const { connect } = require('react-redux');
const ViewContainer = require('./view-container.js');
const Header = require('./header.js');
const HeaderLink = require('./header-link.js');
const Content = require('./content.js');
const AutocompleteMain = require('./autocomplete-main.js');
const TripList = require('./trip-list.js');
const { fetchTripsIfNeeded } = require('./actions.js')
const { CALENDAR, UPCOMING, PAST } = require('./variables.js');

const Calendar = ({ tryFetch }) => {
  return (
    <ViewContainer view={CALENDAR} ref={tryFetch}>
      <Header>
        <HeaderLink filter={UPCOMING}>upcoming</HeaderLink>
        <HeaderLink filter={PAST}>past</HeaderLink>
      </Header>
      <Content>
        <AutocompleteMain/>
        <TripList/>
      </Content>
    </ViewContainer>
  )
}

Calendar.propTypes = {
  tryFetch: React.PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  tryFetch: () => dispatch(fetchTripsIfNeeded())
})

module.exports = connect(null, mapDispatchToProps)(Calendar);
