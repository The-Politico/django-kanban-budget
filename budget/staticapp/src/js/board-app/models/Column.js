import { fk, attr, Model } from 'redux-orm';


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

export default Column;
