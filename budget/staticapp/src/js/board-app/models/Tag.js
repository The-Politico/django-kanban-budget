import { attr, Model } from 'redux-orm';

class Tag extends Model {
  static get options() {
    return {
      idAttribute: 'slug',
    };
  }
}


Tag.modelName = 'Tag';

Tag.fields = {
  slug: attr(),
  name: attr(),
};

export default Tag;
