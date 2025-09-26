import XIcon from '@/assets/icons/xIcon';
import CheckMarkIcon from '@/assets/icons/checkMarkIcon';
import StarIcon from '@/assets/icons/startIcon';
import styles from './ElementDropdown.module.css';

import { useState, useRef, useEffect, useMemo } from 'react';


export default function ElementDropdown({ selectedOption, onSelect, isEditing=true, options = [], hasError=false,
        isMultiSelect=false, selectedOptions,
        labels = { label: 'Elemento', placeholder: 'Pesquisar elemento', noResults: 'Nenhum elemento encontrado'},
        children
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

//==================================The search filtering===================================
    const filteredOptions = options.filter(option =>
        option.isTop || option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

//========================Lookup map for multi-select, for performance=====================
    const optionsById = useMemo(() => {
        const map = new Map();
        (options || []).forEach(o => map.set(o.id, o));
        return map;
    }, [options]);

//====================================Selection handling=====================================
    const handleSelect = (option) => {
        if (isMultiSelect) {
            const id = option.id;
            onSelect(
                selectedOptions.includes(id)
                    ? selectedOptions.filter(o => o !== id) // Removes it
                    : [...selectedOptions, id]              // Adds it
            );
        } else {// Single-select: just replace
            onSelect(option);
            setIsOpen(false);
        }
    };
//===========================================================================================

    return (
        <div className="inputContainer" ref={dropdownRef}>
            <button
                className={`formButtonPicker
                    ${(selectedOption || selectedOptions?.length > 0) ? "hasValue" : ""}
                    ${hasError ? "formInputError" : ""} ${!isEditing ? "readOnly" : ""}`}
                readOnly={!isEditing} type="button" onClick={() => setIsOpen(!isOpen)}
            >
                {isMultiSelect && selectedOptions?.length > 0
                    ? selectedOptions
                        .map((id) => optionsById.get(id)?.name ?? "Unknown")
                        .sort((a, b) => a.localeCompare(b))
                        .join(", ")
                    : !isMultiSelect && selectedOption
                        ? selectedOption.name
                        : ""}
            </button>
            <p id="clientLabel" className="customLabel">{labels.label}</p>
            <p className="errorMessage">{hasError?.message || ""}</p>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <div className={styles.searchWrapper}>
                        {XIcon && <XIcon className={styles.dropdownIcon}/>}
                       <input type="text" className={styles.searchBox} placeholder={labels.placeholder}
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {filteredOptions.length > 0 ? (<>
                        {filteredOptions.map(option => (
                            <div key={option.id} onClick={() => handleSelect(option)}
                                className={`${styles.dropdownOption}
                                    ${isMultiSelect && selectedOptions?.includes(option.id) ? styles.selected : ""}
                                    ${option.isTop ? styles.bestOption : ""}`}
                            >
                                {option.isTop && <StarIcon className={styles.firstOptionIcon} />}
                                {(isMultiSelect && selectedOptions?.includes(option.id)) && (
                                    CheckMarkIcon && <CheckMarkIcon className={styles.dropdownIcon}/>
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
            {children}
        </div>
    );
}