import Modal from '@/components/Modal/Modal';
import FrequencyChart from './components/FrequencyChart';


export default function StaffStatisticsModal({ title, isOpen, onClose }) {
    const workerData = [
        { date: "2025-08-01", count: 3 },
        { date: "2025-08-02", count: 1 },
        { date: "2025-08-03", count: 0 },
        { date: "2025-08-04", count: 2 },
    ];

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <FrequencyChart
                workerName="Maria"
                appointments={workerData}
                totalAppointments={workerData.reduce((sum, d) => sum + d.count, 0)}
            />
        </Modal>
    );
}