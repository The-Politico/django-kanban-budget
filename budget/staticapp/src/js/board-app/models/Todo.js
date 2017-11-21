import { fk, attr, Model } from 'redux-orm';


class Todo extends Model {
  static get fields() {
    return {
      id: attr(),
      title: attr(),
      github_url: attr(),
      created: attr(),
      project: fk('Project', 'todos'),
    };
  }
}

Todo.modelName = 'Todo';

export default Todo;
