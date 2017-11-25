import { fk, attr, many, Model } from 'redux-orm';


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
  github: attr(),
  gdoc: attr(),
  reporters: many('User', 'reporter_projects'),
  editors: many('User', 'editor_projects'),
  developers: many('User', 'developer_projects'),
  notes: attr(),
  type: fk('Type', 'projects'),
  tags: many('Tag'),
  position: attr(),
};

export default Project;
