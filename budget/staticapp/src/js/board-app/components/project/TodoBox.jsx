import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoItem from './Todo';
import TodoEdit from './TodoEdit';


class TodoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditModal: false,
    };
  }

  render() {
    const todosArr = this.props.project.todos.orderBy('created').toModelArray();
    // if (todosArr.length === 0) return null;
    // Display first 2
    const todos = todosArr
      .reverse()
      .slice(0, 2)
      .map(todo => (
        <TodoItem
          actions={this.props.actions}
          todo={todo}
        />
      ));

    const todoExtra = todosArr.length > 2 ?
      (<span><i className="fa fa-plus-square" /> More...</span>) :
      (<span><i className="fa fa-pencil" /> Edit...</span>);

    return (
      <div className="todo-box clearfix">
        <div className="todo-count">
          <div className="title">TODO</div>
          <div className="count">{todosArr.length}</div>
        </div>
        <div className="todo-top3">
          {todos}
          <div className="extra">
            <div
              onClick={() => this.setState({ openEditModal: true })}
            >
              {todoExtra}
            </div>
          </div>
        </div>
        <TodoEdit
          open={this.state.openEditModal}
          todos={todosArr}
          closeModal={() => this.setState({ openEditModal: false })}
          project={this.props.project}
          actions={this.props.actions}
          api={this.props.api}
        />
      </div>
    );
  }
}

TodoBox.propTypes = {
  project: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

export default TodoBox;
