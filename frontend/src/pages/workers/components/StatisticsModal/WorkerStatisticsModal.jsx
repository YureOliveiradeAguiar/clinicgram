import Modal from '@/components/Modal/Modal';
import FrequencyChart from './components/FrequencyChart';


export default function WorkerStatisticsModal({ title, isOpen, onClose }) {
    const appointments = [
        { date: "01", count: 2 },
        { date: "02", count: 0 },
        { date: "03", count: 1 },
        { date: "04", count: 3 },
        { date: "05", count: 0 },
        { date: "06", count: 4 },
        { date: "07", count: 2 },
        { date: "08", count: 5 },
        { date: "09", count: 1 },
        { date: "10", count: 3 },
        { date: "11", count: 0 },
        { date: "12", count: 6 },
        { date: "13", count: 2 },
        { date: "14", count: 4 },
        { date: "15", count: 3 },
        { date: "16", count: 1 },
        { date: "17", count: 0 },
        { date: "18", count: 2 },
        { date: "19", count: 5 },
        { date: "20", count: 3 },
        { date: "21", count: 0 },
        { date: "22", count: 4 },
        { date: "23", count: 6 },
        { date: "24", count: 2 },
        { date: "25", count: 3 },
        { date: "26", count: 1 },
        { date: "27", count: 0 },
        { date: "28", count: 5 },
        { date: "29", count: 2 },
        { date: "30", count: 3 },
        { date: "31", count: 4 },
    ];

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <FrequencyChart workerName="Maria" appointments={appointments} />
        </Modal>
    );
}