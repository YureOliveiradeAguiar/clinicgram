import StarIcon from '@/assets/icons/startIcon';
import styles from './ElementDropdown.module.css';

import { useState, useRef, useEffect } from 'react';


export default function ElementDropdown({ selectedOption, onSelect, isEditing=true, options = [],
        hasError=false, labels = { label: 'Cliente', placeholder: 'Pesquisar cliente...', noResults: 'Nenhum cliente encontrado'},
        isBestOptionFirst=false
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
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="inputContainer" ref={dropdownRef}>
            <button className={`formButtonPicker ${selectedOption ? "hasValue" : hasError ? styles.dropdownError : ""} ${!isEditing ? "readOnly" : ""}`}
                    readOnly={!isEditing} type="button" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption.name : ""}
            </button>
            <p id="clientLabel" className="customLabel">{labels.label}</p>
            <p className="errorMessage">{hasError?.message || ""}</p>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <input type="text" className={styles.searchBox} placeholder={labels.placeholder}
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredOptions.length > 0 ? (<>
                        {isBestOptionFirst && (
                            <div key={filteredOptions[0].id} className={`${styles.dropdownOption} ${styles.bestOption}`}
                                onClick={() => handleSelect(filteredOptions[0])}
                            >
                                <StarIcon className={styles.firstOptionIcon}/> {filteredOptions[0].name}
                                <span className={styles.tooltip}>Recomendado para treinamento</span>
                            </div>
                        )}
                        {filteredOptions
                            .slice(isBestOptionFirst ? 1 : 0)
                            .map((option) => (
                                <div key={option.id} className={styles.dropdownOption} onClick={() => handleSelect(option)}>
                                    {option.name}
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