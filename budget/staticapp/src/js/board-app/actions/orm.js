import * as types from '../constants/actions';

export const createBoard = (board, active) => ({
  type: types.CREATE_BOARD,
  board,
  active,
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

export const deleteProject = slug => ({
  type: types.DELETE_PROJECT,
  slug,
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

export const createUser = (user) => ({
  type: types.CREATE_USER,
  user,
});

export const addReporter = (user, project) => ({
  type: types.ADD_REPORTER,
  user,
  project,
});

export const removeReporter = (user, project) => ({
  type: types.REMOVE_REPORTER,
  user,
  project,
});

export const addEditor = (user, project) => ({
  type: types.ADD_EDITOR,
  user,
  project,
});

export const removeEditor = (user, project) => ({
  type: types.REMOVE_EDITOR,
  user,
  project,
});

export const addDeveloper = (user, project) => ({
  type: types.ADD_DEVELOPER,
  user,
  project,
});

export const removeDeveloper = (user, project) => ({
  type: types.REMOVE_DEVELOPER,
  user,
  project,
});

export const createTag = (tag) => ({
  type: types.CREATE_TAG,
  tag,
});

export const addTag = (tag, project) => ({
  type: types.ADD_TAG,
  tag,
  project,
});

export const removeTag = (tag, project) => ({
  type: types.REMOVE_TAG,
  tag,
  project,
});

export const createType = (projtype) => ({
  type: types.CREATE_TYPE,
  projtype,
});

export const addType = (projtype, project) => ({
  type: types.ADD_TYPE,
  projtype,
  project,
});

export const removeType = (project) => ({
  type: types.REMOVE_TYPE,
  project,
});
