const React = require('react');

const Header = ({ children }) => {
  return (
    <div className='header'>
      <a href='#' className='back'>&#60;&#60;&#60;</a>
      <h2>{ children }</h2>
    </div>
  )
}

Header.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object),
    React.PropTypes.string
  ]).isRequired
}

module.exports = Header;
