import React from 'react';
import PropTypes from 'prop-types';

const Type = (props) => {
  const project = props.project;

  const color = project.type ? project.type.color : null;
  const typeBlock = color ? (
    <div
      className="type-block"
      style={{
        background: color,
      }}
    >{project.type.name}</div>
  ) : null;
  const colorBorder = color ? (
    <div
      className="color-border"
      style={{
        borderBottom: `4px solid ${color}`,
      }}
    />
  ) : null;

  return (
    <div>
      {typeBlock}
      {colorBorder}
    </div>
  );
};

Type.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Type;
