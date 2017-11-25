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
          projects.map(project => {
            const todos = project.todos.slice();
            delete project.todos; // eslint-disable-line no-param-reassign

            const dispatches = todos.map(todo =>
              dispatch(ormActions.createTodo(todo)));

            return Promise.all([
              ...dispatches,
              dispatch(ormActions.createProject(project)),
            ]);
          }
        )
      )
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchProjects;
