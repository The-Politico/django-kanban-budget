import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { BOARD, ROOT, GET } from '../../constants/api';

import { fetchBoardColumns, fetchAllColumns } from './columns';

require('es6-promise').polyfill();

const fetchBoards = () =>
  dispatch => fetch(`${ROOT}api/boards/`, GET)
  .then(
    response => response.json())
    .then(
      boards => {
        const dispatches = boards.map(board =>
          dispatch(ormActions.createBoard(board, board.slug === BOARD)));
        return Promise.all([
          ...dispatches,
          dispatch(fetchBoardColumns(BOARD)),
          dispatch(fetchAllColumns()),
        ]);
      })
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchBoards;
