const React = require('react');
const TripList = require('./trip-list.js');

const CalendarContent = () => {
  return (
    <div className='content'>
      <input placeholder='Where do you want to go?' type='text'/>
      <TripList/>
    </div>
  )
}

module.exports = CalendarContent;
