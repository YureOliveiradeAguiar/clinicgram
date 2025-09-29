import SaveIcon from '@/assets/icons/saveAsIcon';
import styles from './RegisterModal.module.css';

import Modal from '@/components/Modal/Modal';
import ModalButton from '@/components/ModalButton/ModalButton.jsx';


export default function RegisterModal({ title, onSubmit, isOpen, onClose, children }) {
    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={onSubmit} className="standardFormulary">
                {children}
            </form>
            <div className={styles.buttonSection}>
                <ModalButton Icon={SaveIcon} variant="save" type="submit" name="registrar" buttonTitle="Registrar"/>
            </div>
        </Modal>
    );
}