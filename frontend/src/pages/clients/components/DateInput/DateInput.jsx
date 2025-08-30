import DateDropdown from "./DateDropdown/DateDropdown";
import styles from './DateInput.module.css';

import { useEffect } from "react";

export default function DateInput({ onDateChange, hasError=false, clearErrors, isReadOnly=false,
        selectedDay, setSelectedDay, selectedMonth, setSelectedMonth,
        selectedMonthLabel, setSelectedMonthLabel, selectedYear, setSelectedYear  }) {

    
    const formatDateOfBirth = (day, month, year) => {
        if (!year || !month || !day) return null;
        const mm = String(month).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${year}-${mm}-${dd}`;
    };

    useEffect(() => {
        if (!selectedDay || !selectedMonth || !selectedYear) return;
        const formatted = formatDateOfBirth(selectedDay, selectedMonth, selectedYear);
        onDateChange(formatted);
        if (selectedDay && selectedMonth && selectedYear) {
            clearErrors?.()
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    return (
        <div className={styles.formGroup}>
            <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
            <div className={styles.dateWrapper} aria-labelledby="dobLabel">
                <DateDropdown dropdownLabel={selectedDay || "Dia"}
                    optionType={"days"} hasError={hasError} isReadOnly={isReadOnly}
                    onSelect={(day) => {
                        setSelectedDay(day);
                    }}/>
                <DateDropdown dropdownLabel={selectedMonthLabel || "Mês"}
                    optionType={"months"} hasError={hasError} isReadOnly={isReadOnly}
                    onSelect={(monthObject) => {
                        setSelectedMonth(monthObject.value);
                        setSelectedMonthLabel(monthObject.label);
                    }}/>
                <DateDropdown dropdownLabel={selectedYear || "Ano"}
                    optionType={"years"} hasError={hasError} isReadOnly={isReadOnly}
                    onSelect={(year)=> {
                        setSelectedYear(year);
                    }}/>
            </div>
            <p className="errorMessage">{hasError?.message || " "}</p>
        </div>
    )
}