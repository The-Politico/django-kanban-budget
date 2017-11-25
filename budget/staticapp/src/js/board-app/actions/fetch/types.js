import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { ROOT, GET } from '../../constants/api';
import fetchBoards from './board';

require('es6-promise').polyfill();

const fetchTypes = () =>
  dispatch => fetch(`${ROOT}api/types/`, GET)
    .then(
      response => response.json())
    .then(
      types =>
        Promise.all([
          ...types.map(type => dispatch(ormActions.createType(type))),
          dispatch(fetchBoards()),
        ])
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchTypes;
