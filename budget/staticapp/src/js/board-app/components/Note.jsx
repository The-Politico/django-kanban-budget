import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import _ from 'lodash';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from 'draft-js-buttons';
import ApiStatus from './ApiStatus';


const BR = () => (<br />);

const mdSyntax = {
  BOLD: '**',
  ITALIC: '*',
};

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    BlockquoteButton,
    BR,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
  ],
});
const linkifyPlugin = createLinkifyPlugin();

const { InlineToolbar } = inlineToolbarPlugin;

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
    };
    this.toDraft = (mdString) => EditorState.createWithContent(
      convertFromRaw(mdToDraftjs(mdString))
    );
    this.dispatchNotes = this.dispatchNotes.bind(this);
    this.dispatch = _.throttle(this.dispatchNotes, 2500);
    this.onChange = (editorState) => {
      this.setState({ editorState });
      this.props.actions.apiSend();
      this.dispatch();
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.note.project) return;
    if (nextProps.note.open && !this.props.note.open) {
      const project = nextProps.session.Project.withId(nextProps.note.project);
      this.setState({
        editorState: this.toDraft(project.notes),
      });
    }
  }

  dispatchNotes() {
    const slug = this.props.note.project;
    const content = this.state.editorState.getCurrentContent();
    const notes = draftjsToMd(convertToRaw(content), mdSyntax);
    const project = this.props.session.Project.withId(this.props.note.project);
    this.props.actions.apiReset();
    if (notes === project.notes) return;
    this.props.actions.apiSend();
    this.props.actions.patchProject({
      slug,
      notes,
    });
    this.props.actions.updateNotes(slug, notes);
  }

  render() {
    if (!this.props.note.project) return null;
    const project = this.props.session.Project.withId(this.props.note.project);

    return (
      <div>
        <Modal
          isOpen={this.props.note.open}
          onRequestClose={() => this.props.actions.closeNote()}
          style={{
            content: {
              padding: '0px',
              background: '',
            },
          }}
        >
          <ApiStatus api={this.props.api} />
          <i
            className="fa fa-times"
            onClick={() => this.props.actions.closeNote()}
          />
          <div className="editor-container">
            <h1 className="project-title">{project.name}</h1>
            <small><i className="fa fa-pencil" /> Edit notes below.</small>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              plugins={[inlineToolbarPlugin, linkifyPlugin]}
              ref={(element) => { this.editor = element; }}
            />
            <InlineToolbar />
          </div>
        </Modal>
      </div>
    );
  }
}


Note.propTypes = {
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default Note;
