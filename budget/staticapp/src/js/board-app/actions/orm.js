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

export const createTodo = todo => ({
  type: types.CREATE_TODO,
  todo,
});

export const deleteTodo = todo => ({
  type: types.DELETE_TODO,
  todo,
});

export const updateNotes = (slug, notes) => ({
  type: types.UPDATE_NOTES,
  slug,
  notes,
});
