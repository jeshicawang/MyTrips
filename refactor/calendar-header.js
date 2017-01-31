const React = require('react');

const CalendarHeader = () => {
  return (
    <div className='header'>
      <a href='#' className='back'>&#60;&#60;&#60;</a>
      <h2>
        <a className='filter focus' href='#'>upcoming</a>
        <a className='filter' href='#'>past</a>
      </h2>
    </div>
  )
}

module.exports = CalendarHeader;
