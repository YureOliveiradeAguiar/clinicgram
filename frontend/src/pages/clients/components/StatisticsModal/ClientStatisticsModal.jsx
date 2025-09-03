import Modal from '@/components/Modal/Modal';
import ReliabilityChart from './components/ReliabilityChart';


export default function ClientStatisticsModal({ client, title, isOpen, onClose }) {
    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <ReliabilityChart workerName={client.name}/>
        </Modal>
    );
}