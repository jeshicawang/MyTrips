const React = require('react');
const CalendarHeader = require('./calendar-header.js');
const CalendarContent = require('./calendar-content.js');

const Calendar = () => {
  return (
    <div id='calendar' className='container shadow'>
      <CalendarHeader/>
      <CalendarContent/>
    </div>
  )
}

module.exports = Calendar;
