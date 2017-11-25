import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Create from './Create';
import Filter from './Filter';

class TopButtons extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      openCreateModal: false,
      openFilterPanel: false,
    };
    this.state = this.initialState;
    this.closeModal = this.closeModal.bind(this);
    this.closePanel = this.closePanel.bind(this);
  }

  closeModal() {
    this.setState(this.initialState);
  }

  closePanel() {
    this.setState(this.initialState);
  }

  render() {
    return (
      <div>
        <div className="create-filter-buttons">
          <button
            className="create"
            title="Create a new project"
            onClick={() => this.setState({ openCreateModal: true })}
          >
            <i className="fa fa-plus" />
          </button>
          <button
            className="filter"
            title="Filter the board"
            onClick={() => this.setState({
              openFilterPanel: !this.state.openFilterPanel })}
          >
            <i className="fa fa-filter" />
          </button>
        </div>
        <Create
          open={this.state.openCreateModal}
          closeModal={this.closeModal}
          {...this.props}
        />
        <Filter
          open={this.state.openFilterPanel}
          closePanel={this.closePanel}
          filters={this.props.filters}
          session={this.props.session}
          actions={this.props.actions}
        />
      </div>
    );
  }
}

TopButtons.propTypes = {
  actions: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
};

export default TopButtons;
