import * as types from '../constants/actions';

export default (currentState, action) => {
  const initialState = {
    sending: false,
    success: false,
    error: false,
  };

  if (typeof currentState === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.API_SENDING:
      return Object.assign({}, currentState, {
        sending: true,
        success: false,
        error: false,
      });
    case types.API_SUCCESS:
      return Object.assign({}, currentState, {
        sending: false,
        success: true,
        error: false,
      });
    case types.API_ERROR:
      return Object.assign({}, currentState, {
        sending: false,
        success: false,
        error: true,
      });
    case types.API_RESET:
      return Object.assign({}, initialState);
    default:
      break;
  }
  return currentState;
};
