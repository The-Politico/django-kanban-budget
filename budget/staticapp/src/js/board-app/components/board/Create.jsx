import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import marked from 'marked';
import { DropdownList } from 'react-widgets';
import ApiStatus from './../ApiStatus';

class Create extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      openCreateModal: false,
      showDescriptionPreview: false,
      sending: false,
      name: '',
      description: '',
      status: '',
    };
    this.state = this.initialState;
    this.disableButton = this.disableButton.bind(this);
    this.dispatchProject = this.dispatchProject.bind(this);
  }

  disableButton() {
    const name = this.state.name === '';
    const description = this.state.description === '';
    const status = this.state.status === '';
    return name || description || status || this.state.sending;
  }

  dispatchProject() {
    this.setState({ sending: true });
    this.props.actions.apiCreateProject({
      name: this.state.name,
      description: this.state.description,
      status: this.state.status,
    });
    setTimeout(() => {
      this.props.closeModal();
      this.setState(this.initialState);
    }, 1000);
  }

  render() {
    const db = this.props.session;
    const board = db.Board.filter(b => b.active).first();
    const columns = db.Column
      .filter(c => c.board === board.slug)
      .orderBy('position')
      .toModelArray()
      .map(c => ({
        name: c.name,
        slug: c.slug,
      }));

    return (
      <Modal
        isOpen={this.props.open}
        onRequestClose={() => this.props.closeModal()}
        style={{
          content: {
            width: '600px',
            height: '370px',
            left: 'calc(50% - 300px)',
            top: '15%',
            padding: '0',
          },
        }}
      >
        <div className="edit-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              maxLength="250"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={this.state.description}
              maxLength="250"
              onChange={e => this.setState({
                description: e.target.value,
              })}
              hidden={this.state.showDescriptionPreview}
            />
            <div
              className="description-preview"
              dangerouslySetInnerHTML={{ __html: marked(this.state.description) }}
              hidden={!this.state.showDescriptionPreview}
            />
            <div className="preview-opts">
              <button
                className={this.state.showDescriptionPreview ? '' : 'active'}
                onClick={() =>
                  this.setState({ showDescriptionPreview: false })
                }
                title="Edit"
              >
                <i className="fa fa-pencil" />
              </button>
              <button
                className={this.state.showDescriptionPreview ? 'active' : ''}
                onClick={() =>
                  this.setState({ showDescriptionPreview: true })
                }
                title="Preview"
              >
                <i className="fa fa-eye" />
              </button>
            </div>
          </div>
          <div className="clearfix">
            <div className="input-group half">
              <label htmlFor="status">Status</label>
              <DropdownList
                dropUp
                data={columns}
                textField="name"
                valueField="slug"
                value={this.state.status}
                onChange={value => this.setState({
                  status: value.slug,
                })}
              />
            </div>
          </div>
          <div className="input-group">
            <button
              className="create-button"
              disabled={this.disableButton()}
              onClick={this.dispatchProject}
            >
              Create project
            </button>
          </div>
          <ApiStatus api={this.props.api} />
        </div>
        <i
          className="fa fa-times"
          onClick={() => this.props.closeModal()}
        />
      </Modal>
    );
  }
}

Create.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default Create;
