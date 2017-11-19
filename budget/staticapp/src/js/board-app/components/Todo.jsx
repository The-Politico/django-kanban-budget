import React from 'react';
import PropTypes from 'prop-types';

const TodoItem = (props) => (
  <div className="todo-issue">
    <i
      className="fa fa-square-o"
      title="Complete/Close issue"
      onClick={() => {
        props.actions.apiDeleteTodo(props.todo);
        props.actions.deleteTodo(props.todo);
      }}
    />
    <a href={props.todo.github_url} target="_blank" rel="noopener noreferrer">
      {props.todo.title}
    </a>
  </div>
);


TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default TodoItem;
