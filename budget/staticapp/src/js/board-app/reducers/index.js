import { combineReducers } from 'redux';
import orm from './orm';
import note from './note';

export default combineReducers({
  orm,
  note,
});
