import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { ROOT, GET } from '../../constants/api';
import fetchTags from './tags';

require('es6-promise').polyfill();

const fetchUsers = () =>
  dispatch => fetch(`${ROOT}api/users/`, GET)
    .then(
      response => response.json())
    .then(
      users =>
        Promise.all(users.map(user =>
          dispatch(ormActions.createUser(user))
        ).concat([
          dispatch(fetchTags()),
        ]))
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchUsers;
