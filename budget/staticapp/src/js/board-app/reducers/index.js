import { combineReducers } from 'redux';
import orm from './orm';
import note from './note';
import api from './api';

export default combineReducers({
  orm,
  note,
  api,
});
