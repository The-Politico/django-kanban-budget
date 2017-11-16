import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from './orm';
// import * as types from '../constants/actions';

require('es6-promise').polyfill();

const BOARD = document.getElementsByName('board')[0].value;
const TOKEN = document.getElementsByName('token')[0].value;

const headers = {
  headers: {
    Authorization: `Token ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

const GET = Object.assign({}, headers, { method: 'GET' });
const PATCH = Object.assign({}, headers, { method: 'PATCH' });

export const fetchProjects = (column) =>
  dispatch => fetch(`/budget/api/projects/?status=${column}`, GET)
    .then(
      response => response.json())
    .then(
      projects =>
        Promise.all(
          projects.map(d =>
            dispatch(ormActions.createProject(d)))
        )
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export const fetchColumns = (board) =>
  dispatch => fetch(`/budget/api/columns/?board=${board}`, GET)
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
  dispatch => fetch(`/budget/api/boards/${BOARD}/`, GET)
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

export const patchProject = (project) =>
  () => fetch(`/budget/api/projects/${project.slug}/`,
    Object.assign({}, PATCH, { body: JSON.stringify(project) }));
