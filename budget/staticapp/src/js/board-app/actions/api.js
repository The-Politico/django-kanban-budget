import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as ormActions from './orm';
import * as types from '../constants/actions';

import { ROOT, POST, PATCH, DELETE } from '../constants/api';

require('es6-promise').polyfill();


export const apiSend = () => ({
  type: types.API_SENDING,
});
export const apiSuccess = () => ({
  type: types.API_SUCCESS,
});
export const apiError = () => ({
  type: types.API_ERROR,
});
export const apiReset = () => ({
  type: types.API_RESET,
});

const apiResetTimeout = 3000;

let resetTimeout;

export const patchProject = (project) =>
  dispatch => {
    clearTimeout(resetTimeout);
    dispatch(apiSend());
    return fetch(`${ROOT}api/projects/${project.slug}/`,
      _.assign({}, PATCH, { body: JSON.stringify(project) }))
      .then(response => response.json())
      .then(() => {
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return dispatch(apiSuccess());
      })
      .catch((error) => {
        console.log('API ERROR', error);
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return dispatch(apiSuccess());
      });
  };

export const apiCreateProject = (project) =>
  dispatch => {
    clearTimeout(resetTimeout);
    dispatch(apiSend());
    return fetch(`${ROOT}api/projects/`,
      _.assign({}, POST, { body: JSON.stringify(project) }))
      .then(response => response.json())
      .then((sluggedProject) => {
        delete sluggedProject.todos;
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return Promise.all([
          dispatch(ormActions.createProject(sluggedProject)),
          dispatch(apiSuccess()),
        ]);
      })
      .catch((error) => {
        console.log('API ERROR', error);
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return dispatch(apiSuccess());
      });
  };

export const apiDeleteTodo = (todo) =>
  () => fetch(`${ROOT}api/todos/${todo.id}/`, DELETE);

export const apiCreateTodo = (todo) =>
  dispatch => {
    dispatch(apiSend());
    return fetch(`${ROOT}api/todos/`,
      _.assign({}, POST, { body: JSON.stringify(todo) }))
      .then(response => response.json())
      .then((data) => {
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return Promise.all([
          dispatch(apiSuccess()),
          dispatch(ormActions.createTodo(data)),
        ]);
      })
      .catch((error) => {
        console.log('API ERROR', error);
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return dispatch(apiSuccess());
      });
  };

export const apiPatchTodo = (todo) =>
  dispatch => {
    clearTimeout(resetTimeout);
    dispatch(apiSend());
    return fetch(`${ROOT}api/todos/${todo.id}/`,
      _.assign({}, PATCH, { body: JSON.stringify(todo) }))
      .then(response => response.json())
      .then((data) => {
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return Promise.all([
          dispatch(apiSuccess()),
          dispatch(ormActions.createTodo(data)),
        ]);
      })
      .catch((error) => {
        console.log('API ERROR', error);
        resetTimeout = setTimeout(() => dispatch(apiReset()), apiResetTimeout);
        return dispatch(apiSuccess());
      });
  };
