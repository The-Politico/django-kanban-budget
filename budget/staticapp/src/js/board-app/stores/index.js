import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import reducers from '../reducers/';
import actions from '../actions/';

const store = createStore(reducers, compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f));

store.dispatch(actions.fetchUsers());

store.subscribe(() => {
  window.store = _.assign({}, store.getState());
});

export default store;
