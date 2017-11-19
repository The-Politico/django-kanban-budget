import * as types from '../constants/actions';

export default (currentState, action) => {
  const initialState = {
    project: null,
    open: false,
  };

  if (typeof currentState === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.SET_NOTE:
      return Object.assign({}, currentState, {
        project: action.note.project,
        open: true,
      });
    case types.OPEN_NOTE:
      return Object.assign({}, currentState, {
        open: true,
      });
    case types.CLOSE_NOTE:
      return Object.assign({}, currentState, {
        open: false,
      });
    default:
      break;
  }
  return currentState;
};
