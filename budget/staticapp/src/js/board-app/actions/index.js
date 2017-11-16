import _ from 'lodash';
import * as apiActions from './api';
import * as ormActions from './orm';
import * as noteActions from './note';

export default _.assign({},
  apiActions,
  ormActions,
  noteActions
);
