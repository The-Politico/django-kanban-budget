import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './board-app/containers/App';
import store from './board-app/stores/';

import '../scss/main.scss';
import '../scss/board.scss';


const BoardApp = () =>
  <Provider store={store}>
    <App />
  </Provider>;

ReactDOM.render(
  <BoardApp />, document.getElementById('board'));
