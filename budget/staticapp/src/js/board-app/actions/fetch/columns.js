import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { ROOT, GET } from '../../constants/api';
import fetchProjects from './projects';

require('es6-promise').polyfill();


export const fetchBoardColumns = (board) =>
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


export const fetchAllColumns = () =>
  dispatch => fetch(`${ROOT}api/columns/`, GET)
    .then(
      response => response.json())
    .then(
      columns =>
        Promise.all(columns.map(column =>
          Promise.all([
            dispatch(ormActions.createColumn(column)),
          ])
        ))
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });
