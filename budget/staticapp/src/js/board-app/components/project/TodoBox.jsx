import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoItem from './Todo';


class TodoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFullList: false,
    };
  }

  render() {
    if (this.props.todos.length === 0) return null;
    // Display first 3
    const todos = this.props.todos
      .reverse()
      .slice(0, 2)
      .map(todo => (
        <TodoItem
          actions={this.props.actions}
          todo={todo}
        />
      ));

    const todoExtra = this.props.todos.length > 2 ?
      (<span><i className="fa fa-plus-square" /> More...</span>) :
      (<span><i className="fa fa-pencil" /> Edit...</span>);

    return (
      <div className="todo-box clearfix">
        <div className="todo-count">
          <div className="title">TODO</div>
          <div className="count">{this.props.todos.length}</div>
        </div>
        <div className="todo-top3">
          {todos}
          <div className="extra">
            {todoExtra}
          </div>
        </div>
      </div>
    );
  }
}

TodoBox.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default TodoBox;
