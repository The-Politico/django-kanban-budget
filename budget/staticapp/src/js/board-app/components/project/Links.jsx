import React from 'react';
import PropTypes from 'prop-types';

const Links = (props) => {
  const project = props.project;

  const github = project.github ? (
    <a href={project.github} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-github-alt" title="Github" />
    </a>
  ) : '';

  const google = project.gdoc ? (
    <a href={project.gdoc} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-google" title="GoogleDoc" />
    </a>
  ) : '';

  const preview = project.preview_url ? (
    <a href={project.preview_url} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-eye" title="Preview" />
    </a>
  ) : '';

  const publish = project.publish_url ? (
    <a href={project.publish_url} target="_blank" rel="noopener noreferrer">
      <i className="fa fa-external-link" title="Link" />
    </a>
  ) : '';

  return (
    <div className="links">
      <div>
        {publish}
        {preview}
        {github}
        {google}
      </div>
    </div>
  );
};

Links.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Links;
