import _ from 'lodash';
import * as apiActions from './api';
import * as ormActions from './orm';
import * as noteActions from './note';
import fetchBoard from './fetch/board';
import fetchColumns from './fetch/columns';
import fetchProjects from './fetch/projects';
import fetchTags from './fetch/tags';
import fetchTypes from './fetch/types';
import fetchUsers from './fetch/users';


const actions = _.assign({},
  apiActions,
  ormActions,
  noteActions,
  {
    fetchBoard,
    fetchColumns,
    fetchProjects,
    fetchTags,
    fetchTypes,
    fetchUsers,
  });

export default actions;
