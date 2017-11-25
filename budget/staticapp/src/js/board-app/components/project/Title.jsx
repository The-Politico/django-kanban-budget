import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import marked from 'marked';

marked.setOptions({ smartypants: true });

const Title = (props) => {
  const project = props.project;

  const time = project.run_date !== null ?
    moment(project.run_date).fromNow() : false;
  // eslint-disable-next-line no-nested-ternary
  const verb = time ? moment(project.run_date).isAfter() ?
    'Running' : 'Ran' : null;

  return (
    <div className="title">
      <small>{time ? `${verb} ${time}` : ''}</small>
      <h4>{project.name}</h4>
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: marked(project.description) }}
      />
    </div>
  );
};


Title.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Title;
