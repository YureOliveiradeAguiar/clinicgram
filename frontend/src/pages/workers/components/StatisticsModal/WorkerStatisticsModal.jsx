import Modal from '@/components/Modal/Modal';
import FrequencyChart from './components/FrequencyChart';


export default function WorkerStatisticsModal({ title, isOpen, onClose }) {
    const consultations = [
        { id: 1, date: "2025-08-02", rating: 5 },
        { id: 2, date: "2025-08-03", rating: 5 },
        { id: 3, date: "2025-08-03", rating: 2 },
        { id: 4, date: "2025-08-05", rating: 5 },
        { id: 5, date: "2025-08-07", rating: 5 },
        { id: 6, date: "2025-08-09", rating: 5 },
        { id: 7, date: "2025-08-11", rating: 5 },
        { id: 8, date: "2025-08-12", rating: 5 },
        { id: 9, date: "2025-08-15", rating: 5 },
        { id: 10, date: "2025-08-16", rating: 5 },
        { id: 11, date: "2025-08-18", rating: 2 },
        { id: 12, date: "2025-08-19", rating: 2 },
        { id: 13, date: "2025-08-21", rating: 2 },
        { id: 14, date: "2025-08-22", rating: 5 },
        { id: 15, date: "2025-08-22", rating: 2 },
        { id: 16, date: "2025-08-25", rating: 2 },
        { id: 17, date: "2025-08-26", rating: 2 },
        { id: 18, date: "2025-08-28", rating: 2 },
        { id: 19, date: "2025-08-30", rating: 2 },
        { id: 20, date: "2025-08-31", rating: 2 },
    ];
    //console.log("consultations: ", consultations);
    // Preprocess into one object per day and simplifies date format.
    const data = consultations.reduce((acc, { date, rating }) => {
        const day = date.slice(-2); // "2025-08-01" -> "01"
        if (!acc[day]) {
            acc[day] = { date: day, consultations: 0, totalRating: 0 };
        }
        acc[day].consultations += 1;
        acc[day].totalRating += rating;
        return acc;
    }, {});
    //console.log("data: ", data);
    const chartData = Object.values(data)
        .map(d => ({
            date: d.date,
            consultations: d.consultations,
            rating: d.totalRating / d.consultations, // Average rating.
        })).sort((a, b) => a.date - b.date);
    //console.log("chartData: ", chartData);

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <FrequencyChart workerName="Maria" chartData={chartData} />
        </Modal>
    );
}