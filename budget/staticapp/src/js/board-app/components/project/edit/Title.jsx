import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateTime from 'react-datetime';
import marked from 'marked';

marked.setOptions({ smartypants: true });

class Title extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDescriptionPreview: false,
    };
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            maxLength="250"
            name="name"
            value={project.name}
            onChange={(e) => this.props.patchProject({
              slug: project.slug,
              name: e.target.value,
            })}
          />
        </div>
        <div className="input-group">
          <label htmlFor="run_date">Run date</label>
          <DateTime
            inputProps={{
              name: 'run_date',
            }}
            value={new Date(project.run_date)}
            dateFormat="MMM. D, YYYY"
            timeFormat="h:mm A"
            onChange={(moment) => this.props.patchProject({
              slug: project.slug,
              run_date: moment.format(),
            })}
          />
        </div>
        <div className="input-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={project.description}
            maxLength="250"
            onChange={(e) => this.props.patchProject({
              slug: project.slug,
              description: e.target.value,
            })}
            hidden={this.state.showDescriptionPreview}
          />
          <div
            className="description-preview"
            dangerouslySetInnerHTML={{ __html: marked(project.description) }}
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
      </div>
    );
  }
}

Title.propTypes = {
  project: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  patchProject: PropTypes.func.isRequired,
};

export default Title;
