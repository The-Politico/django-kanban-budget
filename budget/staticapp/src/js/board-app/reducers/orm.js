import * as types from '../constants/actions';
import orm from '../models/';

export default (dbState, action) => {
  if (typeof dbState === 'undefined') {
    return orm.getEmptyState();
  }

  const session = orm.session(dbState);
  const { Board, Column, Project, Todo } = session;


  switch (action.type) {
    case types.CREATE_BOARD:
      Board.upsert(action.board);
      break;
    case types.CREATE_COLUMN:
      Column.upsert(action.column);
      break;
    case types.CREATE_PROJECT:
      Project.upsert(action.project);
      break;
    case types.UPDATE_PROJECT:
      Project.withId(action.project.slug).update({
        status: action.project.status,
        position: action.project.position,
      });
      break;
    case types.UPDATE_NOTES:
      Project.withId(action.slug).update({
        notes: action.notes,
      });
      break;
    case types.CREATE_TODO:
      Todo.upsert(action.todo);
      break;
    case types.DELETE_TODO:
      Todo.withId(action.todo.id).delete();
      break;
    default:
      break;
  }
  return session.state;
};
