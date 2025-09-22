import StarIcon from '@/assets/icons/startIcon';
import styles from './ElementDropdown.module.css';

import { useState, useRef, useEffect } from 'react';


export default function ElementDropdown({ selectedOption, onSelect, isEditing=true, options = [], hasError=false,
        isMultiSelect=false, selectedOptions,
        labels = { label: 'Elemento', placeholder: 'Pesquisar elemento...', noResults: 'Nenhum elemento encontrado'},
    }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef();

    useEffect(() => { // Closes on outside click.
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.isTop || option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        if (isMultiSelect) {
            // If multi-select, toggle the option in the selected list
            if (selectedOptions.includes(option)) {// Remove it
                onSelect(selectedOptions.filter((o) => o !== option));
            } else {// Add it
                onSelect([...selectedOptions, option]);
            }
        } else {// Single-select: just replace
            onSelect(option);
            setIsOpen(false);
        }
    };

    return (
        <div className="inputContainer" ref={dropdownRef}>
            <button 
                className={`formButtonPicker ${(selectedOption || selectedOptions?.length > 0)
                    ? "hasValue" : hasError ? styles.dropdownError : ""} ${!isEditing ? "readOnly" : ""}`}
                readOnly={!isEditing} type="button" onClick={() => setIsOpen(!isOpen)}>
                {isMultiSelect && selectedOptions?.length > 0
                    ? selectedOptions.map((opt) => opt.name).join(", ")
                    : !isMultiSelect && selectedOption
                        ? selectedOption.name
                        : ""}
            </button>
            <p id="clientLabel" className="customLabel">{labels.label}</p>
            <p className="errorMessage">{hasError?.message || ""}</p>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <input type="text" className={styles.searchBox} placeholder={labels.placeholder}
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredOptions.length > 0 ? (<>
                        {filteredOptions.map(option => (
                            <div key={option.id} onClick={() => handleSelect(option)}
                                className={`${styles.dropdownOption} ${option.isTop ? styles.bestOption : ""}`}
                            >
                                {option.isTop && <StarIcon className={styles.firstOptionIcon} />}
                                {isMultiSelect && (
                                    <input type="checkbox" checked={selectedOptions?.some(o => o.id === option.id)} readOnly/>
                                )}
                                {option.name}
                                {option.isTop && (
                                    <span className={styles.tooltip}>Recomendado para treinamento</span>
                                )}
                            </div>
                        ))}
                    </>) : (
                        <p className={styles.dropdownNoOption}>{labels.noResults}</p>
                    )}
                </div>
            )}
        </div>
    );
}