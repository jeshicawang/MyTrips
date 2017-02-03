const React = require('react');
const Header = require('./header.js');
const HeaderLink = require('./header-link.js')
const Content = require('./content.js');
const Autocomplete = require('./autocomplete.js');
const TripList = require('./trip-list.js')

const Calendar = () => {
  return (
    <div id='calendar' className='container shadow'>
      <Header>
        <HeaderLink>UPCOMING</HeaderLink>
        <HeaderLink>PAST</HeaderLink>
      </Header>
      <Content>
        <Autocomplete/>
        <TripList/>
      </Content>
    </div>
  )
}

Calendar.propTypes = {
  trips: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)
}

module.exports = Calendar;
