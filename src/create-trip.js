const React = require('react');
const { connect } = require('react-redux');
const ViewContainer = require('./view-container.js')
const Header = require('./header.js');
const Content = require('./content.js');
const TripForm = require('./trip-form.js');
const { CREATE_TRIP } = require('./actions.js');

const CreateTrip = ({ existingInfo }) => {
  return (
    <ViewContainer view={CREATE_TRIP}>
      <Header>Create Trip</Header>
      <Content>
        <TripForm info={existingInfo}/>
      </Content>
    </ViewContainer>
  )
}

CreateTrip.propTypes = {
  existingInfo: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  existingInfo: state.createTrip
})

module.exports = connect(mapStateToProps)(CreateTrip);
