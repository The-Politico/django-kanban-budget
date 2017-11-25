// import moment from 'moment';
import * as types from '../constants/actions';

export default (currentState, action) => {
  const initialState = {
    developers: [],
    types: [],
    startDate: null,
    endDate: null,
  };

  if (typeof currentState === 'undefined') {
    return initialState;
  }

  let filters;
  let i;

  switch (action.type) {
    case types.ADD_FILTER_DEVELOPER:
      filters = currentState.developers.slice();
      i = filters.indexOf(action.id);
      if (i < 0) filters.push(action.id);
      return Object.assign({}, currentState, {
        developers: filters,
      });
    case types.REMOVE_FILTER_DEVELOPER:
      filters = currentState.developers.slice();
      i = filters.indexOf(action.id);
      if (i >= 0) filters.splice(i, 1);
      return Object.assign({}, currentState, {
        developers: filters,
      });
    case types.ADD_FILTER_TYPE:
      filters = currentState.types.slice();
      i = filters.indexOf(action.slug);
      if (i < 0) filters.push(action.slug);
      return Object.assign({}, currentState, {
        types: filters,
      });
    case types.REMOVE_FILTER_TYPE:
      filters = currentState.types.slice();
      i = filters.indexOf(action.slug);
      if (i >= 0) filters.splice(i, 1);
      return Object.assign({}, currentState, {
        types: filters,
      });
    case types.SET_FILTER_DATE_RANGE:
      return Object.assign({}, currentState, {
        startDate: action.startDate,
        endDate: action.endDate,
      });
    case types.RESET_FILTERS:
      return Object.assign({}, initialState);
    default:
      break;
  }
  return currentState;
};
