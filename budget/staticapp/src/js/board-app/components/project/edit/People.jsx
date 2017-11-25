import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Multiselect } from 'react-widgets';


const bestID = (d) => {
  if (d.last_name && d.first_name) return `${d.first_name} ${d.last_name}`;
  if (d.last_name) return d.last_name;
  if (d.email) return d.email;
  if (d.username) return d.username;
  return 'Anonymous';
};

class People extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePeople: 'reporters',
    };
  }

  render() {
    const project = this.props.project;
    const db = this.props.session;

    const userset = (queryset) =>
      queryset
        .toRefArray()
        .map(d => ({ user: bestID(d), id: d.id }));

    const User = db.User;

    return (
      <div className="clearfix people">
        <div className="button-group">
          <button
            className={this.state.activePeople === 'reporters' ? 'active' : ''}
            onClick={() => this.setState({ activePeople: 'reporters' })}
          >Reporters</button>
          <button
            className={this.state.activePeople === 'editors' ? 'active' : ''}
            onClick={() => this.setState({ activePeople: 'editors' })}
          >Editors</button>
          <button
            className={this.state.activePeople === 'developers' ? 'active' : ''}
            onClick={() => this.setState({ activePeople: 'developers' })}
          >Developers</button>
        </div>
        <div
          className="input-group half"
          hidden={!(this.state.activePeople === 'reporters')}
        >
          <Multiselect
            name="reporters"
            value={userset(project.reporters)}
            data={userset(User.filter(u => u.reporter))}
            textField="user"
            valueField="id"
            onChange={value => this.props.patchProject({
              slug: project.slug,
              reporters: value.map(d => d.id),
            })}
          />
        </div>
        <div
          className="input-group half"
          hidden={!(this.state.activePeople === 'editors')}
        >
          <Multiselect
            name="editors"
            value={userset(project.editors)}
            data={userset(User.filter(u => u.editor))}
            textField="user"
            valueField="id"
            onChange={value => this.props.patchProject({
              slug: project.slug,
              editors: value.map(d => d.id),
            })}
          />
        </div>
        <div
          className="input-group half"
          hidden={!(this.state.activePeople === 'developers')}
        >
          <Multiselect
            name="developers"
            value={userset(project.developers)}
            data={userset(User.filter(u => u.developer))}
            textField="user"
            valueField="id"
            onChange={value => this.props.patchProject({
              slug: project.slug,
              developers: value.map(d => d.id),
            })}
          />
        </div>
      </div>
    );
  }
}

People.propTypes = {
  project: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  patchProject: PropTypes.func.isRequired,
};

export default People;
