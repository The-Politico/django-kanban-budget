import * as types from '../constants/actions';
import orm from '../models/';

export default (dbState, action) => {
  if (typeof dbState === 'undefined') {
    return orm.getEmptyState();
  }

  const session = orm.session(dbState);
  const { Board, Column, Project } = session;


  switch (action.type) {
    case types.CREATE_BOARD:
      Board.create(action.board);
      break;
    case types.CREATE_COLUMN:
      Column.create(action.column);
      break;
    case types.CREATE_PROJECT:
      Project.create(action.project);
      break;
    case types.UPDATE_PROJECT:
      Project.withId(action.project.slug).update({
        status: action.project.status,
        position: action.project.position,
      });
      break;
    default:
      break;
  }
  return session.state;
};
