import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext as dragDropContext } from 'react-dnd';
import _ from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import Actions from '../actions/';
import Board from '../components/Board';
import orm from '../models';
import Note from '../components/Note';


const App = (props) => {
  const actions = bindActionCreators(Actions, props.dispatch);
  return (
    <div>
      <Note
        note={props.board.note}
        actions={actions}
      />
      <Board
        session={orm.session(props.board.orm)}
        actions={actions}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  board: state,
});

App.propTypes = {
  dispatch: PropTypes.object.isRequired,
  board: PropTypes.object.isRequired,
  orm: PropTypes.object.isRequired,
};

export default _.flow(
  connect(mapStateToProps),
  dragDropContext(HTML5Backend)
)(App);
