import React from 'react';
import Modal from "../../../components/modal/Modal";

function RemoveModal({user, ...props}) {
    return (
        <Modal title={'Remove user '.concat(user['username'])}
               {...props}>
            <p>This action cannot be undone. Are you sure?</p>
        </Modal>
    );
}

export default RemoveModal;