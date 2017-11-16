import * as types from '../constants/actions';

export const createBoard = board => ({
  type: types.CREATE_BOARD,
  board,
});

export const createColumn = column => ({
  type: types.CREATE_COLUMN,
  column,
});

export const createProject = project => ({
  type: types.CREATE_PROJECT,
  project,
});

export const updateProject = project => ({
  type: types.UPDATE_PROJECT,
  project,
});
