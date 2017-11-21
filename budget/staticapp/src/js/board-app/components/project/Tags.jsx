import React from 'react';
import PropTypes from 'prop-types';

const Tags = (props) => {
  const project = props.project;

  const tags = project.tags.toRefArray().map(d => (
    <div className="tag">{d.name}</div>
  ));

  return (
    <div className="tags">
      {tags}
    </div>
  );
};

Tags.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Tags;
