import DateDropdown from "./DateDropdown/DateDropdown";
import styles from './DateInput.module.css';

import { useState, useEffect } from "react";

export default function DateInput({ onDateChange, hasError, clearErrors }) {

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);
    
    const formatDateOfBirth = (day, month, year) => {
        if (!year || !month || !day) return null;
        const mm = String(month).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${year}-${mm}-${dd}`;
    };

    useEffect(() => {
        const formatted = formatDateOfBirth(selectedDay, selectedMonth, selectedYear);
        onDateChange(formatted);
        if (selectedDay && selectedMonth && selectedYear) {
            clearErrors();
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    return (
        <div className={styles.formGroup}>
            <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
            <div className={styles.dateWrapper} aria-labelledby="dobLabel">
                <DateDropdown dropdownLabel={selectedDay || "Dia"} optionType={"days"} hasError={hasError}
                    onSelect={(day) => {
                        setSelectedDay(day);
                    }}/>
                <DateDropdown dropdownLabel={selectedMonthLabel || "Mês"} optionType={"months"} hasError={hasError}
                    onSelect={(monthObject) => {
                        setSelectedMonth(monthObject.value);
                        setSelectedMonthLabel(monthObject.label);
                    }}/>
                <DateDropdown dropdownLabel={selectedYear || "Ano"} optionType={"years"} hasError={hasError}
                    onSelect={(year)=> {
                        setSelectedYear(year);
                    }}/>
            </div>
            <p className="errorMessage">{hasError?.message || " "}</p>
        </div>
    )
}