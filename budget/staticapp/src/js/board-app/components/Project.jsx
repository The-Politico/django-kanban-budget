import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

import TopButtons from './project/TopButtons';
import Title from './project/Title';
import TodoBox from './project/TodoBox';
import People from './project/People';
import Tags from './project/Tags';
import Links from './project/Links';
import Type from './project/Type';
import ArchiveConfirm from './project/ArchiveConfirm';


const projectSource = {
  beginDrag(props) {
    return {
      slug: props.slug,
      index: props.index,
    };
  },
};

const projectTarget = {
  drop(props) {
    props.saveOnDrop();
  },
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.changeProjectPosition(monitor.getItem().slug, hoverIndex);
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
  },
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showArchiveConfirm: false,
    };
  }

  render() {
    const {
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
    } = this.props;

    const project = this.props.session.Project.withId(this.props.slug);

    const dragClass = this.props.isDragging ?
      'transparent' : '';

    return connectDragPreview(connectDropTarget(
      <div className={`project ${dragClass}`}>
        <TopButtons
          project={project}
          actions={this.props.actions}
          showArchiveConfirm={() => this.setState({ showArchiveConfirm: true })}
        />
        <Title project={project} />
        <TodoBox
          actions={this.props.actions}
          api={this.props.api}
          project={project}
        />
        <People project={project} />
        <Tags project={project} />
        <Links project={project} />
        <Type project={project} />
        {connectDragSource(
          <div className="drag-handle">
            <div className="drag-dots">. .</div>
            <div className="drag-dots">. .</div>
            <div className="drag-dots">. .</div>
            <div className="drag-dots">. .</div>
          </div>
        )}
        <ArchiveConfirm
          projectSlug={project.slug}
          open={this.state.showArchiveConfirm}
          closeModal={() => this.setState({ showArchiveConfirm: false })}
          patchProject={this.props.actions.patchProject}
          deleteProject={this.props.actions.deleteProject}
        />
      </div>
    ));
  }
}

Project.propTypes = {
  actions: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  saveOnDrop: PropTypes.func.isRequired,
  changeProjectColumn: PropTypes.func.isRequired,
  changeProjectPosition: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
};

export default _.flow(
  dragSource(ItemTypes.PROJECT, projectSource, collectSource),
  dropTarget(ItemTypes.PROJECT, projectTarget, collectTarget)
)(Project);
