const React = require('react');
const { connect } = require('react-redux');
const ViewContainer = require('./view-container.js')
const Header = require('./header.js');
const Content = require('./content.js');
const TripForm = require('./trip-form.js');
const { viewChanged } = require('../actions/action-creators.js');
const { CALENDAR, CREATE_TRIP } = require('../constants/views.js');

const CreateTrip = ({ handleClick, existingInfo }) => {
  return (
    <ViewContainer view={CREATE_TRIP}>
      <Header handleClick={handleClick}>Create Trip</Header>
      <Content>
        <TripForm info={existingInfo}/>
      </Content>
    </ViewContainer>
  )
}

CreateTrip.propTypes = {
  handleClick: React.PropTypes.func.isRequired,
  existingInfo: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  existingInfo: state.createTrip
})

const mapDispatchToProps = (dispatch) => ({
  handleClick: () => dispatch(viewChanged(CALENDAR))
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(CreateTrip);
