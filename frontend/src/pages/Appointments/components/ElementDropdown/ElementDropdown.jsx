import styles from './ElementDropdown.module.css';

import { useState, useRef, useEffect } from 'react';


export default function ElementDropdown({ value, onChange, isEditing=true, options = [], selectedOption, setSelectedOption,
        error, labels = { label: 'Cliente', placeholder: 'Pesquisar cliente...', noResults: 'Nenhum cliente registrado',
    },}) {
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
            <button className={`formInput formButtonPicker ${!isEditing ? "readOnly" : ""}`} readOnly={!isEditing}
                    type="button" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption ? selectedOption.name : "Selecione um cliente"}
            </button>
            <p id="clientLabel" className="customLabel">{labels.label}</p>
            <p className="errorMessage">{error || ""}</p>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <input type="text" className={styles.searchBox} placeholder={labels.placeholder}
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div key={option.id} className={styles.dropdownOption}
                                onClick={() => handleSelect(option)}>
                                {option.name}
                            </div>
                        ))
                    ) : (
                        <p className={styles.dropdownNoOption}>{labels.noResults}</p>
                    )}
                </div>
            )}
        </div>
    );
}