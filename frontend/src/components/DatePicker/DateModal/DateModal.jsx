import styles from './DateModal.module.css';

import Modal from '@/components/Modal/Modal';
import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable';


export default function DateModal({ isOpen, onClose, // For modal UI
        selectedStartHours, setSelectedStartHours, selectedEndHours, setSelectedEndHours, selectedDay, setSelectedDay, // For date selection
        startOffset, setStartOffset, startDate, days, times, matrix, // For schedule table structuration.
        selectedIndexes, setSelectedIndexes, occupiedIndexes, isDateValid,
    }) {
//=======================================Base Structure Of The Schedule Table=========================================
    const rawMonth = startDate.toLocaleString('pt-BR', { month: 'long' });
    const monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const year = startDate.getFullYear();

//=====================================================================================================================

    return (
        <Modal title="Seleção de Horários" isOpen={isOpen} onClose={onClose} maxWidth='640px'>
            <div className={styles.hoursWrapper}>
                <ScheduleTable mode={"scheduling"} occupiedIndexes={occupiedIndexes} 
                    days={days} times={times} indexedCells={matrix}

                    startTime={selectedStartHours} endTime={selectedEndHours}
                    setStartTime={setSelectedStartHours} setEndTime={setSelectedEndHours}
                    scheduledDay={selectedDay} setScheduledDay={setSelectedDay}

                    selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}
                    startOffset={startOffset} setStartOffset={setStartOffset}
                    monthName={monthName} year={year}
                    hasError={!isDateValid}
                />
            </div>
            
        </Modal>
    );
}