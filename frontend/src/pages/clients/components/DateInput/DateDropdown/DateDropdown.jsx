import ArrowDownIcon from '@/assets/icons/arrowDown.jsx'
import ArrowUpIcon from '@/assets/icons/arrowUp.jsx'
import styles from './DateDropdown.module.css';

import { useState, useRef, useEffect, useMemo } from 'react';

export default function DateDropdown ({ dropdownLabel, optionType, locale = navigator.language, onSelect, hasError=false }) {
    const [isOpen, setIsOpen] = useState(false);

    const options = useMemo(() => {
        if (optionType === "days") {
            return Array.from({ length: 31 }, (_, i) => i + 1);
        }
        if (optionType === "months") {
            return Array.from({ length: 12 }, (_, i) => ({
                value: i + 1,
                label: new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1))
            }));
        }
        if (optionType === "years") {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 120 }, (_, i) => currentYear - i);
        }
        return [];
    }, [optionType, locale]);

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => { setIsOpen(prev => !prev);};

    const handleOptionClick = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={`${styles.dropdown} ${hasError ? styles.dropdownError : ""}`} ref={dropdownRef}>
            <div className={styles.dropdownToggle} onClick={toggleDropdown}>
                <span className={styles.dropdownLabel}>
                    {dropdownLabel}
                </span>
                {isOpen ? (
                    <ArrowUpIcon className={styles.icon} />
                ) : (
                    <ArrowDownIcon className={styles.icon} />
                )}
            </div>

            {isOpen && (
                <ul className={styles.options}>
                    {options.map((option,i) => (
                        <li key={i} className={styles.option} onClick={() => handleOptionClick(option)}>
                            {optionType === "months" ? option.label : option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}