const React = require('react');
const { connect } = require('react-redux');
const ViewContainer = require('./view-container.js')
const Header = require('./header.js');
const Content = require('./content.js');
const { CREATE_TRIP } = require('./actions.js');

const CreateTrip = () => {
  return (
    <ViewContainer view={CREATE_TRIP}>
      <Header>Create Trip</Header>
      <Content></Content>
    </ViewContainer>
  )
}

module.exports = CreateTrip;
