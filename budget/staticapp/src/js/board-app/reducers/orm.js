import * as types from '../constants/actions';
import orm from '../models/';

export default (dbState, action) => {
  if (typeof dbState === 'undefined') {
    return orm.getEmptyState();
  }

  const session = orm.session(dbState);
  const { Board, Column, Project, Todo, User, Tag, Type } = session;


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
    case types.DELETE_PROJECT:
      Project.withId(action.slug).delete();
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
    case types.CREATE_USER:
      User.upsert(action.user);
      break;
    case types.ADD_REPORTER:
      Project
        .withId(action.project)
        .reporters.add(action.user);
      break;
    case types.REMOVE_REPORTER:
      Project
        .withId(action.project)
        .reporters.remove(action.user);
      break;
    case types.ADD_EDITOR:
      Project
        .withId(action.project)
        .editors.add(action.user);
      break;
    case types.REMOVE_EDITOR:
      Project
        .withId(action.project)
        .editors.remove(action.user);
      break;
    case types.ADD_DEVELOPER:
      Project
        .withId(action.project)
        .developers.add(action.user);
      break;
    case types.REMOVE_DEVELOPER:
      Project
        .withId(action.project)
        .developers.remove(action.user);
      break;
    case types.CREATE_TAG:
      Tag.upsert(action.tag);
      break;
    case types.ADD_TAG:
      Project
        .withId(action.project)
        .tags.add(action.tag);
      break;
    case types.REMOVE_TAG:
      Project
        .withId(action.project)
        .tags.remove(action.tag);
      break;
    case types.CREATE_TYPE:
      Type.upsert(action.projtype);
      break;
    case types.ADD_TYPE:
      Project
        .withId(action.project)
        .type = action.projtype;
      break;
    case types.REMOVE_TYPE:
      Project
        .withId(action.project)
        .type = null;
      break;
    default:
      break;
  }
  return session.state;
};
