import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const RecordModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="custom-modal">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>New Record!!!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecordModal;
