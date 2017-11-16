import React from 'react';
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it';
import { UnmountClosed } from 'react-collapse';

const md = markdownIt().use(require('markdown-it-checkbox'), {
  divWrap: true,
  divClass: 'checkbox',
});


const Note = (props) => (
  <UnmountClosed
    isOpened={props.note.open}
    fixedHeight={225}
    theme={{ collapse: 'notes', content: 'notes-content' }}
  >
    <h4 className="project-title">{props.note.title}</h4>
    <div
      className="body"
      dangerouslySetInnerHTML={{ __html: md.render(props.note.body) }}
    />
    <i
      className="fa fa-times"
      onClick={() => props.actions.closeNote()}
    />
  </UnmountClosed>
);

Note.propTypes = {
  actions: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
};

export default Note;
