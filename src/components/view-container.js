const React = require('react');
const { CALENDAR, CREATE_TRIP } = require('../variables.js');

const ViewContainer = ({ children, view }) => {
  const id = (view === CALENDAR) ? 'calendar' : (view === CREATE_TRIP) ? 'create-trip' : '';
  return (
    <div id={id} className='container shadow'>
      { children }
    </div>
  )
}

ViewContainer.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  view: React.PropTypes.string.isRequired
}

module.exports = ViewContainer;
