import { attr, Model } from 'redux-orm';


class User extends Model {
  static get fields() {
    return {
      id: attr(),
      username: attr(),
      first_name: attr(),
      last_name: attr(),
      email: attr(),
    };
  }
}

User.modelName = 'User';

export default User;
