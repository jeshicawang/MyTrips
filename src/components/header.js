const React = require('react');

const Header = ({ handleClick, children }) => {
  return (
    <div className='header'>
      <a href='#' className='back' onClick={handleClick}>&#60;&#60;&#60;</a>
      <h2>{ children }</h2>
    </div>
  )
}

Header.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object),
    React.PropTypes.string
  ]).isRequired
}

module.exports = Header;
