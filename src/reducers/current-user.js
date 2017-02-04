const { DEFAULTS } = require('../variables.js');

const initialState = DEFAULTS.USER;

const currentUser = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

module.exports = currentUser;
