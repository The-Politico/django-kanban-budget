import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget as dropTarget } from 'react-dnd';
import _ from 'lodash';
import Project from './Project';
import ItemTypes from '../constants/itemTypes';

const columnTarget = {
  hover(props, monitor) {
    const projectSlug = monitor.getItem().slug;
    const project = _.find(props.projects, { slug: projectSlug });
    // If project is not in column projects array already,
    // change the project's column.
    if (typeof project === 'undefined') {
      props.changeProjectColumn(projectSlug, props.slug);
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const Column = (props) => {
  const { connectDropTarget, isOver, projects } = props;

  const column = props.session.Column.withId(props.slug);

  const Projects = _.sortBy(
    projects, ['position'])
    .map(project => (
      <Project {...props}
        slug={project.slug}
        index={project.position}
        saveOnDrop={props.saveOnDrop}
        changeProjectColumn={props.changeProjectColumn}
        changeProjectPosition={props.changeProjectPosition}
      />
    ));

  const dropClass = isOver ? 'droppable' : '';

  return connectDropTarget(
    <div className={`column ${dropClass}`}>
      <div className="column-header">
        <h3>{column.name}</h3>
      </div>
      <div className="column-inner-well">
        {Projects}
      </div>
    </div>
  );
};

Column.propTypes = {
  actions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  saveOnDrop: PropTypes.func.isRequired,
  changeProjectColumn: PropTypes.func.isRequired,
  changeProjectPosition: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default dropTarget(ItemTypes.PROJECT, columnTarget, collect)(Column);
