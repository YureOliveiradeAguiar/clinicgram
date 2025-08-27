import ArrowDownIcon from '@/assets/icons/arrowDown.jsx'
import ArrowUpIcon from '@/assets/icons/arrowUp.jsx'
import styles from './DateDropdown.module.css';

import { useState, useRef, useEffect } from 'react';

function Dropdown ({ label, options, onSelect, hasError=false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(label);

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

    useEffect(() => { // Reacts to external label changes for Form reset.
        setSelected(label);
    }, [label]);

    const toggleDropdown = () => { setIsOpen(prev => !prev);};

    const handleOptionClick = (option) => {
        setSelected(option);
        setIsOpen(false);
        if (onSelect) onSelect(option);
    };

    return (
        <div className={`${styles.dropdown} ${hasError ? styles.dropdownError : ""}`} ref={dropdownRef}>
            <div className={styles.dropdownToggle} onClick={toggleDropdown}>
                <p className={styles.selectedOption}>{selected}</p>
                {isOpen ? (
                    <ArrowUpIcon className={styles.icon} />
                ) : (
                    <ArrowDownIcon className={styles.icon} />
                )}
            </div>

            {isOpen && (
                <ul className={styles.options}>
                    {options.map(opt => (
                        <li key={opt} className={styles.option} onClick={() => handleOptionClick(opt)}>{opt}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown