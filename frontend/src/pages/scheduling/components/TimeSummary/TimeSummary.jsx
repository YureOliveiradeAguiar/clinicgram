import ArrowDown from '@/assets/icons/arrowDown.jsx'
import ScheduleIcon from '@/assets/icons/scheduleIcon.jsx'
import styles from "./TimeSummary.module.css";

import { useState } from "react";

export default function TimeSummary({ descriptionText, errorText, hasError }) {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString("pt-BR"); // Format: DD/MM/YY
    });

    const handleDateClick = () => {
        // TODO: Replace with real calendar popup logic
        const fakeNewDate = prompt("Escolha uma data (DD/MM/YY):", selectedDate);
        if (fakeNewDate) {
            setSelectedDate(fakeNewDate);
            // TODO: Trigger scheduling reload based on new date
        }
    };

    return (
        <div className={styles.timeSummaryContainer}>
            <button className={styles.dateButton} onClick={handleDateClick}>
                <div className={styles.buttonIcons}>
                    {ArrowDown && <ArrowDown className={styles.icon} />}
                    {ScheduleIcon && <ScheduleIcon className={styles.icon} />}
                </div>
                2a7
            </button>
            <div className={`${styles.description} ${hasError ? styles.timeSumError : ''}`}>
                {hasError ? errorText : descriptionText}
            </div>
        </div>
    );
}
