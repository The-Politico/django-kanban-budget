import { combineReducers } from 'redux';
import orm from './orm';
import note from './note';
import api from './api';
import filters from './filters';

export default combineReducers({
  orm,
  note,
  api,
  filters,
});
