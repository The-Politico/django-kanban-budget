import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { BOARD, ROOT, GET } from '../../constants/api';

import fetchColumns from './columns';

require('es6-promise').polyfill();

const fetchBoard = () =>
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

export default fetchBoard;
