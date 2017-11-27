import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import _ from 'lodash';
import ApiStatus from './../ApiStatus';


class TodoEdit extends Component {
  constructor(props) {
    super(props);

    this.propsToTodo = this.propsToTodo.bind(this);
    this.mergeStateTodos = this.mergeStateTodos.bind(this);

    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);

    this.dispatchTodo = this.dispatchTodo.bind(this);
    this.dispatch = _.throttle(this.dispatchTodo, 2500);

    this.state = {
      openFullList: false,
      todos: this.propsToTodo(props.todos),
    };
  }

  componentWillReceiveProps(nextProps) {
    // If switching projects, set new todos from props.
    if (this.props.project.slug !== nextProps.project.slug) {
      this.setState({
        todos: this.propsToTodo(nextProps.todos),
      });
      return;
    }
    // If a todo was deleted in props, reset.
    if (this.props.todos.length > nextProps.todos.length) {
      this.setState({
        todos: this.propsToTodo(nextProps.todos),
      });
      return;
    }
    // If same project, do nothing if state and props out of sync
    // while waiting on API...
    if (this.state.todos.length !== nextProps.todos.length) return;
    // ... or if current and next props are the same...
    if (_.isEqual(this.props.todos, nextProps.todos)) return;
    // ... otherwise, merge todos with props.
    this.mergeStateTodos(nextProps.todos);
    return;
  }

  /**
   * Return an array of sorted todos.
   *
   * Sorting is important because sort order by timestamp is how
   * we match props to todos in component state when filling in
   * missing info with response from the API (mergeStateTodos).
   */
  propsToTodo(todos) {
    return _.sortBy(todos.map(d => ({
      id: d.id,
      title: d.title,
      github_url: d.github_url,
      project: this.props.project.slug,
      created: new Date(d.created),
    })), ['created']).reverse();
  }

  /**
   * Merge todos rendered from props with those in state.
   *
   * Merges ids and github_urls when complete data is sent
   * from the server. Counts on sort order by created time to
   * match todos in state with those rendered from props.
   */
  mergeStateTodos(nextTodos) {
    const todos = this.propsToTodo(nextTodos);
    this.setState({
      todos: todos.map((d, i) => {
        const todo = this.state.todos[i];
        return _.assign({}, todo, {
          id: todo.id ? todo.id : d.id,
          github_url: todo.github_url ? todo.github_url : d.github_url,
        });
      }),
    });
  }

  updateTodo(index, todo) {
    const todos = this.state.todos.slice();
    const updatedTodo = _.assign({}, todos[index], todo);
    todos.splice(index, 1, updatedTodo);
    this.setState({ todos }, () => {
      // If a todo doesn't have an ID, we're waiting on it from
      // the server and don't want to dispatch a second POST
      // request which will create a duplicate todo. (In theory,
      // a todo could get out of sync with server if last update
      // happens before the server returns an ID.)
      if (!updatedTodo.id) return;
      this.dispatch(_.assign({}, updatedTodo));
    });
  }

  addTodo() {
    const todos = this.state.todos.slice();
    const newTodo = {
      id: null,
      title: 'New todo',
      github_url: null,
      project: this.props.project.slug,
      created: new Date(),
    };
    todos.unshift(newTodo);
    this.setState({ todos }, () => {
      this.dispatch(_.assign({}, newTodo));
    });
  }

  removeTodo(todo, index) {
    const todos = this.state.todos.slice();
    todos.splice(index, 1);
    this.setState({ todos }, () => {
      this.props.actions.apiDeleteTodo(todo);
      this.props.actions.deleteTodo(todo);
    });
  }

  dispatchTodo(todo) {
    if (todo.title === '') return;
    if (!todo.id) {
      this.props.actions.apiCreateTodo({
        title: todo.title,
        project: todo.project,
      });
    } else {
      this.props.actions.apiPatchTodo(todo);
    }
  }

  render() {
    const todos = this.state.todos.map((d, i) => (
      <div className="todo">
        <i
          className="fa fa-square-o"
          title="Complete/Close issue"
          onClick={() => this.removeTodo(d, i)}
        />
        <input
          type="text"
          value={d.title}
          onChange={(e) => this.updateTodo(i, {
            title: e.target.value,
          })}
          maxLength="100"
        />
        {d.github_url ? (
          <a
            href={d.github_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-github-alt" />
          </a>
        ) : null}
      </div>
    ));

    const height = (22 * this.state.todos.length) + 100;

    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={this.props.closeModal}
        style={{
          content: {
            width: '350px',
            height: `${height}px`,
            left: 'calc(50% - 175px)',
            top: '25%',
            padding: '0',
          },
        }}
      >
        <div className="todo-edit">
          <h3>
            TODO
            <button
              onClick={this.addTodo}
            >
              <i className="fa fa-plus" /> Add
            </button>
          </h3>
          <div className="todos">
            {todos}
          </div>
          <i
            className="fa fa-times"
            onClick={this.props.closeModal}
          />
          <ApiStatus api={this.props.api} />
        </div>
      </Modal>
    );
  }
}

TodoEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  todos: PropTypes.array.isRequired,
  project: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};

export default TodoEdit;
