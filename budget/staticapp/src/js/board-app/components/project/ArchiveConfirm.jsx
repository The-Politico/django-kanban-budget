import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const ConfirmModal = (props) => (
  <Modal
    isOpen={props.open}
    style={{
      content: {
        width: '250px',
        height: '100px',
        left: 'calc(50% - 125px)',
        top: '40%',
      },
    }}
  >
    <div className="archive-dialog">
      <p>Are you sure you want to archive this project?</p>
      <div>
        <button
          onClick={() => {
            props.closeModal();
            props.patchProject({
              slug: props.projectSlug,
              archive: true,
            });
            props.deleteProject(props.projectSlug);
          }}
        >
          Yes
        </button>
        <button
          onClick={props.closeModal}
        >
          No
        </button>
      </div>
    </div>
  </Modal>
);

ConfirmModal.propTypes = {
  projectSlug: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  patchProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
};

export default ConfirmModal;
