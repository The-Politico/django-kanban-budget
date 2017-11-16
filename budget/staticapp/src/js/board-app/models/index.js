import { fk, attr, Model, ORM } from 'redux-orm';

class Board extends Model {
  static get options() {
    return {
      idAttribute: 'slug',
    };
  }
}

Board.modelName = 'Board';

Board.fields = {
  name: attr(),
  slug: attr(),
  position: attr(),
};

class Column extends Model {
  static get options() {
    return {
      idAttribute: 'slug',
    };
  }
}

Column.modelName = 'Column';

Column.fields = {
  board: fk('Board', 'columns'),
  name: attr(),
  slug: attr(),
  position: attr(),
};

class Project extends Model {
  static get options() {
    return {
      idAttribute: 'slug',
    };
  }
}

Project.modelName = 'Project';

Project.fields = {
  status: fk('Column', 'projects'),
  name: attr(),
  slug: attr(),
  description: attr(),
  run_date: attr(),
  preview_url: attr(),
  publish_url: attr(),
  edit_url: attr(),
  github: attr(),
  gdoc: attr(),
  reporters: attr(),
  editors: attr(),
  developers: attr(),
  notes: attr(),
  type: attr(),
  tags: attr(),
  position: attr(),
};

const orm = new ORM();
orm.register(Board, Column, Project);

export default orm;
