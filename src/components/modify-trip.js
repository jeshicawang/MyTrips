const React = require('react');
const { connect } = require('react-redux');
const ViewContainer = require('./view-container.js')
const Header = require('./header.js');
const Content = require('./content.js');
const TripForm = require('./trip-form.js');
const { viewChanged, submitModifyTrip } = require('../actions/action-creators.js');
const { CALENDAR, MODIFY_TRIP } = require('../constants/views.js');

const ModifyTrip = ({ handleClick, handleSubmit, existingInfo }) => {
  return (
    <ViewContainer view={MODIFY_TRIP}>
      <Header handleClick={handleClick}>Modify Trip</Header>
      <Content>
        <TripForm view={MODIFY_TRIP} handleSubmit={handleSubmit} info={existingInfo}/>
      </Content>
    </ViewContainer>
  )
}

ModifyTrip.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  existingInfo: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  existingInfo: state.modifyTrip
})

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => dispatch(viewChanged(CALENDAR)),
  handleSubmit: (event) => {
    event.preventDefault();
    dispatch(submitModifyTrip())
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(ModifyTrip);
