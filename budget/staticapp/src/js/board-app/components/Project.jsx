import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import marked from 'marked';
import moment from 'moment';
import _ from 'lodash';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';
import ItemTypes from '../constants/itemTypes';
import TodoBox from './project/TodoBox';
import ArchiveConfirm from './project/ArchiveConfirm';
import Links from './project/Links';

marked.setOptions({ smartypants: true });

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

    /*
     * Interior content with defaults
    */
    const time = project.run_date !== null ?
      moment(project.run_date, 'YYYY-MM-DD').fromNow() : false;
    // eslint-disable-next-line no-nested-ternary
    const verb = time ? moment(project.run_date, 'YYYY-MM-DD').isAfter() ?
      'Running' : 'Ran' : null;

    const todo = project.todos
      .toRefArray().length > 0 ?
        (
          <TodoBox
            actions={this.props.actions}
            todos={project.todos.orderBy('created').toModelArray()}
          />) : null;

    const reporters = project.reporters.length > 0 ? (
      <ul>
        {project.reporters.map(d => (<li>{d.last_name}</li>))}
      </ul>
    ) : (<ul><li className="empty">—</li></ul>);

    const editors = project.editors.length > 0 ? (
      <ul>
        {project.editors.map(d => (<li>{d.last_name}</li>))}
      </ul>
    ) : (<ul><li className="empty">—</li></ul>);

    const developers = project.developers.length > 0 ? (
      <ul>
        {project.developers.map(d => (<li>{d.last_name}</li>))}
      </ul>
    ) : (<ul><li className="empty">—</li></ul>);

    const tags = project.tags.map(d => (
      <div className="tag">{d}</div>
    ));

    const color = project.type ? project.type.color : null;
    const typeBlock = color ? (
      <div
        className="type-block"
        style={{
          background: color,
        }}
      >{project.type.name}</div>
    ) : null;
    const colorBorder = color ? (
      <div
        className="color-border"
        style={{
          borderBottom: `4px solid ${color}`,
        }}
      />
    ) : null;

    const dragClass = this.props.isDragging ?
      'transparent' : '';

    return connectDragPreview(connectDropTarget(
      <div className={`project ${dragClass}`}>
        <div className="title">
          <small>{time ? `${verb} ${time}` : ''}</small>
          <h4>{project.name}</h4>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: marked(project.description) }}
          />
        </div>
        {todo}
        <div className="people">
          <div className="col">
            <h6>Reporters</h6>
            {reporters}
          </div>
          <div className="col">
            <h6>Editors</h6>
            {editors}
          </div>
          <div className="col">
            <h6>Developers</h6>
            {developers}
          </div>
        </div>
        <div className="tags">
          {tags}
        </div>
        <Links project={project} />
        <div className="top-buttons">
          <i
            className="fa fa-pencil"
            title="Edit"
            onClick={() => { window.location = project.edit_url; }}
          />
          <i
            className="fa fa-sticky-note-o fa-fw"
            title="Notes"
            onClick={() => this.props.actions.setNote({
              project: project.slug,
            })}
          />
          <i
            className="fa fa-trash-o"
            title="Archive"
            onClick={() => this.setState({ showArchiveConfirm: true })}
          />
        </div>
        {typeBlock}
        {colorBorder}
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
};

export default _.flow(
  dragSource(ItemTypes.PROJECT, projectSource, collectSource),
  dropTarget(ItemTypes.PROJECT, projectTarget, collectTarget)
)(Project);
