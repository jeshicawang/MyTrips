const React = require('react');

const Content = ({ children }) => {
  return (
    <div className='content'>
      { children }
    </div>
  )
}

Content.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)
}

module.exports = Content;
