import React from 'react';
import PropTypes from 'prop-types';

const ApiStatus = (props) => (
  <div className="api-status">
    <i
      className="fa fa-circle-o-notch fa-spin fa-fw sending"
      hidden={!props.api.sending}
    />
    <i
      className="fa fa-check-circle-o fa-fw success"
      hidden={!props.api.success}
    />
    <i
      className="fa fa-times-circle-o fa-fw error"
      hidden={!props.api.error}
    />
  </div>
);

ApiStatus.propTypes = {
  api: PropTypes.object.isRequired,
};

export default ApiStatus;
