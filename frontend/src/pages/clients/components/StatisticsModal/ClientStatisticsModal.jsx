import Modal from '@/components/Modal/Modal';

import ReliabilityChart from './components/ReliabilityChart';


export default function ClientStatisticsModal({ title, onSubmit, isOpen, onClose }) {
    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <ReliabilityChart confirmed={20} attended={17} missed={3} />
        </Modal>
    );
}