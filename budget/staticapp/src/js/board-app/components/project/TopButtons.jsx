import React from 'react';
import PropTypes from 'prop-types';

const TopButtons = (props) => (
  <div className="top-buttons">
    <i
      className="fa fa-pencil"
      title="Edit"
      onClick={() => { window.location = props.project.edit_url; }}
    />
    <i
      className="fa fa-sticky-note-o fa-fw"
      title="Notes"
      onClick={() => props.actions.setNote({
        project: props.project.slug,
      })}
    />
    <i
      className="fa fa-trash-o"
      title="Archive"
      onClick={props.showArchiveConfirm}
    />
  </div>
);


TopButtons.propTypes = {
  project: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  showArchiveConfirm: PropTypes.func.isRequired,
};

export default TopButtons;
