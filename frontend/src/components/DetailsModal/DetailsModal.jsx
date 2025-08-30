import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';
import styles from './DetailsModal.module.css';

import Modal from '@/components/Modal/Modal';
import ModalButton from '@/components/ModalButton/ModalButton.jsx';


export default function DetailsModal({ title, isOpen, isEditing, setIsEditing,
        onSave, onCancel, onDelete, onClose, children }) {

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            {children}
            <div className={styles.buttonRow}>
                <ModalButton Icon={TrashCan} onClick={onDelete} variant="delete"/>
                {!isEditing ? (
                    <ModalButton Icon={EditIcon} onClick={() => setIsEditing(true)} variant="edit"/> 
                ) : (<div className={styles.editingButtonsRow}>
                        <ModalButton Icon={SaveIcon} onClick={() => onSave()} variant="save"/> 
                        <ModalButton Icon={CancelIcon} variant="default" onClick={() => onCancel()}/>
                    </div>)}
            </div>
        </Modal>
    );
}