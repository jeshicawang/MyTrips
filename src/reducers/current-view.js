const DEFAULTS = require('../constants/defaults.js');
const { VIEW_CHANGED } = require('../constants/action-types.js')

const initialState = DEFAULTS.VIEW;

const currentView = (state = initialState, action) => {
  switch (action.type) {
    case VIEW_CHANGED:
      return action.view;
    default:
      return state;
  }
}

module.exports = currentView;
