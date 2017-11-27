import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import _ from 'lodash';
import validUrl from 'valid-url';
import 'react-widgets/lib/scss/react-widgets.scss';
import ApiStatus from './../ApiStatus';
import Title from './edit/Title';
import People from './edit/People';
import Links from './edit/Links';
import Status from './edit/Status';


class ProjectEdit extends Component {
  constructor(props) {
    super(props);

    this.patchProject = this.patchProject.bind(this);
    this.patchLink = this.patchLink.bind(this);
    this.dispatchProject = this.dispatchProject.bind(this);
    this.dispatch = _.throttle(this.dispatchProject, 2500);
  }

  patchLink(project, link) {
    this.props.actions.createProject(project);
    this.props.actions.apiSend();
    // Only dispatch when link is valid
    if (validUrl.isUri(link) || link === '') this.dispatch(project);
  }

  patchProject(project) {
    this.props.actions.createProject(project);
    this.props.actions.apiSend();
    this.dispatch(project);
  }

  dispatchProject(project) {
    this.props.actions.patchProject(project);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={this.props.closeModal}
        style={{
          content: {
            width: '700px',
            height: 'auto',
            maxHeight: '90%',
            left: 'calc(50% - 350px)',
            top: '5%',
            padding: '0',
            position: 'relative',
          },
        }}
      >
        <i
          className="fa fa-times"
          onClick={this.props.closeModal}
        />
        <div className="edit-form">
          <Title
            project={this.props.project}
            session={this.props.session}
            patchProject={this.patchProject}
          />
          <hr />
          <People
            project={this.props.project}
            session={this.props.session}
            patchProject={this.patchProject}
          />
          <hr />
          <Status
            project={this.props.project}
            session={this.props.session}
            patchProject={this.patchProject}
            closeModal={this.closeModal}
          />
          <hr />
          <Links
            project={this.props.project}
            session={this.props.session}
            patchLink={this.patchLink}
          />
          <ApiStatus api={this.props.api} />
        </div>
      </Modal>
    );
  }
}

ProjectEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};


export default ProjectEdit;
