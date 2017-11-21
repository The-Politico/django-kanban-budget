import { attr, Model } from 'redux-orm';


class Type extends Model {
  static get options() {
    return {
      idAttribute: 'slug',
    };
  }
}

Type.modelName = 'Type';

Type.fields = {
  slug: attr(),
  name: attr(),
  color: attr(),
};

export default Type;
