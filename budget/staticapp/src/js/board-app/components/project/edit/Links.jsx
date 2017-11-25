import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Links extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLink: 'github',
    };
  }

  render() {
    const project = this.props.project;
    return (
      <div className="clearfix">
        <div className="button-group">
          <button
            className={this.state.activeLink === 'github' ? 'active' : ''}
            onClick={() => this.setState({ activeLink: 'github' })}
          >Github</button>
          <button
            className={this.state.activeLink === 'google' ? 'active' : ''}
            onClick={() => this.setState({ activeLink: 'google' })}
          >Google Doc</button>
          <button
            className={this.state.activeLink === 'preview' ? 'active' : ''}
            onClick={() => this.setState({ activeLink: 'preview' })}
          >Preview</button>
          <button
            className={this.state.activeLink === 'publish' ? 'active' : ''}
            onClick={() => this.setState({ activeLink: 'publish' })}
          >Publish</button>
        </div>
        <div className="two-thirds">
          <div
            className="input-group"
            hidden={!(this.state.activeLink === 'github')}
          >
            <input
              name="github"
              type="url"
              value={project.github}
              onChange={(e) => this.props.patchLink({
                slug: project.slug,
                github: e.target.value,
              }, e.target.value)}
            />
          </div>
          <div
            className="input-group"
            hidden={!(this.state.activeLink === 'google')}
          >
            <input
              name="gdoc"
              type="url"
              value={project.gdoc}
              onChange={(e) => this.props.patchLink({
                slug: project.slug,
                gdoc: e.target.value,
              }, e.target.value)}
            />
          </div>
          <div
            className="input-group"
            hidden={!(this.state.activeLink === 'preview')}
          >
            <input
              name="preview_url"
              type="url"
              value={project.preview_url}
              onChange={(e) => this.props.patchLink({
                slug: project.slug,
                preview_url: e.target.value,
              }, e.target.value)}
            />
          </div>
          <div
            className="input-group"
            hidden={!(this.state.activeLink === 'publish')}
          >
            <input
              name="publish_url"
              type="url"
              value={project.publish_url}
              onChange={(e) => this.props.patchLink({
                slug: project.slug,
                publish_url: e.target.value,
              }, e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

Links.propTypes = {
  project: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  patchLink: PropTypes.func.isRequired,
};

export default Links;
