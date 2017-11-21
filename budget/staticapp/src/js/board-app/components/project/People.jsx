import React from 'react';
import PropTypes from 'prop-types';

const bestID = (d) => {
  if (d.last_name) return d.last_name;
  if (d.email) return d.email;
  if (d.username) return d.username;
  return 'Anonymous';
};

const People = (props) => {
  const project = props.project;

  const reportersArr = project.reporters.toRefArray();
  const editorsArr = project.editors.toRefArray();
  const developersArr = project.developers.toRefArray();

  const reporters = reportersArr.length > 0 ? (
    <ul>
      {reportersArr.map(d => (<li>{bestID(d)}</li>))}
    </ul>
  ) : (<ul><li className="empty">—</li></ul>);

  const editors = editorsArr.length > 0 ? (
    <ul>
      {editorsArr.map(d => (<li>{bestID(d)}</li>))}
    </ul>
  ) : (<ul><li className="empty">—</li></ul>);

  const developers = developersArr.length > 0 ? (
    <ul>
      {developersArr.map(d => (<li>{bestID(d)}</li>))}
    </ul>
  ) : (<ul><li className="empty">—</li></ul>);

  return (
    <div className="people">
      <div className="col">
        <h6>Reporters</h6>
        {reporters}
      </div>
      <div className="col">
        <h6>Editors</h6>
        {editors}
      </div>
      <div className="col">
        <h6>Developers</h6>
        {developers}
      </div>
    </div>
  );
};

People.propTypes = {
  project: PropTypes.object.isRequired,
};

export default People;
