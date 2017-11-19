import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as ormActions from './orm';
import * as types from '../constants/actions';

require('es6-promise').polyfill();

const BOARD = document.getElementsByName('board')[0].value;
const TOKEN = document.getElementsByName('token')[0].value;
const ROOT = document.getElementsByName('root')[0].value;

const headers = {
  headers: {
    Authorization: `Token ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

const GET = Object.assign({}, headers, { method: 'GET' });
const PATCH = Object.assign({}, headers, { method: 'PATCH' });
const DELETE = Object.assign({}, headers, { method: 'DELETE' });


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


export const fetchProjects = (column) =>
  dispatch => fetch(`${ROOT}api/projects/?status=${column}`, GET)
    .then(
      response => response.json())
    .then(
      projects =>
        Promise.all(
          projects.map(d => {
            const todos = d.todos.slice();
            delete d.todos; // eslint-disable-line no-param-reassign
            const todosDispatch = todos.map(t => {
              const todo = _.assign({}, t, { project: d.slug });
              return dispatch(ormActions.createTodo(todo));
            });
            return Promise.all([
              dispatch(ormActions.createProject(d)),
            ].concat(todosDispatch));
          }
        )
      )
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export const fetchColumns = (board) =>
  dispatch => fetch(`${ROOT}api/columns/?board=${board}`, GET)
    .then(
      response => response.json())
    .then(
      columns =>
        Promise.all(columns.map(column =>
          Promise.all([
            dispatch(ormActions.createColumn(column)),
            dispatch(fetchProjects(column.slug)),
          ])
        ))
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export const fetchBoard = () =>
  dispatch => fetch(`${ROOT}api/boards/${BOARD}/`, GET)
  .then(
    response => response.json())
    .then(
      board =>
        Promise.all([
          dispatch(ormActions.createBoard(board)),
          dispatch(fetchColumns(BOARD)),
        ])
      )
    .catch((error) => {
      console.log('API ERROR', error);
    });


let resetTimeout;

export const patchProject = (project) =>
  dispatch => {
    clearTimeout(resetTimeout);
    dispatch(apiSend());
    return fetch(`${ROOT}api/projects/${project.slug}/`,
      _.assign({}, PATCH, { body: JSON.stringify(project) }))
      .then(response => response.json())
      .then(() => {
        resetTimeout = setTimeout(() => dispatch(apiReset()), 3000);
        return dispatch(apiSuccess());
      })
      .catch((error) => {
        console.log('API ERROR', error);
        resetTimeout = setTimeout(() => dispatch(apiReset()), 3000);
        return dispatch(apiSuccess());
      });
  };

export const apiDeleteTodo = (todo) =>
  () => fetch(`${ROOT}api/todos/${todo.id}/`, DELETE);
