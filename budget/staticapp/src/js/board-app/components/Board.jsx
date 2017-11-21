import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Column from '../components/Column';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };

    this.saveOnDrop = this.saveOnDrop.bind(this);
    this.changeProjectColumn = this.changeProjectColumn.bind(this);
    this.changeProjectPosition = this.changeProjectPosition.bind(this);
  }

  componentWillReceiveProps(props) {
    const { Project } = props.session;
    const newProjects = Project.all().toRefArray()
      .map(project => ({
        slug: project.slug,
        position: project.position,
        column: project.status,
      }));
    this.state = {
      projects: this.reSerialize(newProjects),
    };
  }

  /**
   * Persists state to server and redux state whenever a user drops a project.
   * @return {none}
   */
  saveOnDrop() {
    const ProjectModel = this.props.session.Project;
    const projects = ProjectModel.all().toModelArray();
    const stateProjects = this.state.projects.slice();
    projects.forEach(p => {
      // Grab project from state and compare to project in ORM
      const sp = _.find(stateProjects, { slug: p.slug });
      // If position or status/column don't match...
      if (sp.column !== p.status.slug || sp.position !== p.position) {
        // ... patch the server
        this.props.actions.patchProject({
          slug: p.slug,
          status: sp.column,
          position: sp.position,
        });
        // .. and update state.
        this.props.actions.updateProject({
          slug: p.slug,
          status: sp.column,
          position: sp.position,
        });
      }
    });
  }

  /**
   * Re-serializes projects within columns.
   *
   * We do this b/c we expect to get multiple projects that claim the same
   * position within a column list, both from the server and as a result
   * of dragging projects around.
   *
   * @param  {array} sortProjects Project objects to reorder
   * @return {array}              Projects objects with correct position
   */
  reSerialize(sortProjects) {
    const nestedProjects = _.values(_.groupBy(sortProjects, 'column')).map(projects =>
      _.sortBy(projects, ['position']).map((project, index) =>
        Object.assign(project, { position: index }))
    );
    // Flatten the nested, sorted lists back to one array
    const flatProjects = [].concat([], ...nestedProjects);
    return flatProjects;
  }

  /**
   * Changes column of a project and calls reserializer.
   * @param  {string} projectSlug Project slug
   * @param  {string} columnSlug  Column slug
   * @return {none}
   */
  changeProjectColumn(projectSlug, columnSlug) {
    const newProjects = this.state.projects
      .map((project) => {
        // Change the column of the changed project
        if (project.slug === projectSlug) {
          return Object.assign(project, {
            column: columnSlug,
          });
        }
        return project;
      });
    this.setState({
      projects: this.reSerialize(newProjects),
    });
  }

  /**
   * Change project position within column
   * @param  {string} projectSlug Project slug
   * @param  {integer} index       New position.
   * @return {none}
   */
  changeProjectPosition(projectSlug, index) {
    const projects = this.state.projects.slice();
    const project = _.find(projects, { slug: projectSlug });
    const columnProjects = _.filter(projects, { column: project.column });
    const sortedColumnProjects = _.sortBy(columnProjects, ['position']);

    // Remove and reinsert changed project at index
    _.remove(sortedColumnProjects, p => p.slug === project.slug);
    sortedColumnProjects.splice(index, 0, project);

    // Set new positions by new array index
    const newColumnProjects = sortedColumnProjects.map((p, i) =>
      Object.assign(p, { position: i }));

    // Add new column projects back to other projects
    const newProjects = newColumnProjects.concat(
      _.filter(this.state.projects, p => p.column !== project.column)
    );

    this.setState({
      projects: this.reSerialize(newProjects),
    });
  }

  render() {
    const ColumnModel = this.props.session.Column;
    const Columns = ColumnModel.all().toRefArray().map(column => {
      const projects = _.filter(this.state.projects, { column: column.slug });
      return (
        <Column
          {...this.props}
          slug={column.slug}
          projects={projects}
          saveOnDrop={this.saveOnDrop}
          changeProjectColumn={this.changeProjectColumn}
          changeProjectPosition={this.changeProjectPosition}
        />
      );
    });
    return (
      <div className="board">
        {Columns}
      </div>
    );
  }
}

Board.propTypes = {
  actions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

export default Board;
