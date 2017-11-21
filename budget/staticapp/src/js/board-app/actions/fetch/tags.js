import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import * as ormActions from '../orm';
import { ROOT, GET } from '../../constants/api';
import fetchTypes from './types';

require('es6-promise').polyfill();

const fetchTags = () =>
  dispatch => fetch(`${ROOT}api/tags/`, GET)
    .then(
      response => response.json())
    .then(
      tags =>
        Promise.all(tags.map(tag =>
          dispatch(ormActions.createTag(tag))
        ).concat([
          dispatch(fetchTypes()),
        ]))
    )
    .catch((error) => {
      console.log('API ERROR', error);
    });

export default fetchTags;
