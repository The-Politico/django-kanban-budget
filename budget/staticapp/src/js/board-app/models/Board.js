import { attr, Model } from 'redux-orm';


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

export default Board;
