const React = require('react');
const Header = require('./header.js');
const Content = require('./content.js');
const Autocomplete = require('./autocomplete.js');
const TripList = require('./trip-list.js')

const Calendar = () => {
  return (
    <div id='calendar' className='container shadow'>
      <Header>
        <a className='filter focus' href='#'>upcoming</a>
        <a className='filter' href='#'>past</a>
      </Header>
      <Content>
        <Autocomplete/>
        <TripList/>
      </Content>
    </div>
  )
}

module.exports = Calendar;
