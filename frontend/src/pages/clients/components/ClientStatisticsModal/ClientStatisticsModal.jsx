import Modal from '@/components/Modal/Modal';


export default function RegisterModal({ title, onSubmit, isOpen, onClose, children }) {
    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={onSubmit} className="standardFormulary">
                {children}
            </form>
        </Modal>
    );
}