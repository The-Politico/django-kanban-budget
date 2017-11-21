import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { ROOT, GET } from '../../constants/api';

require('es6-promise').polyfill();

const fetchProjects = (column) =>
  dispatch => fetch(`${ROOT}api/projects/?status=${column}`, GET)
    .then(
      response => response.json())
    .then(
      projects =>
        Promise.all(
          projects.map(d => {
            const todos = d.todos.slice();
            delete d.todos; // eslint-disable-line no-param-reassign

            const dispatches = todos.map(todo =>
              dispatch(ormActions.createTodo(todo)));

            const promises = dispatches.concat(
              [
                dispatch(ormActions.createProject(d)),
              ]);

            return Promise.all(promises);
          }
        )
      )
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchProjects;
