import { useState, useRef, useEffect } from 'react';
import styles from './SearchDropdown.module.css';

function SearchDropdown({ options = [], selectedOption, onSelect, hasError, labels = {
        label: 'Selecione o Cliente', optionName : 'Selecione um cliente',
        placeholder: 'Pesquisar cliente...', noResults: 'Nenhum cliente registrado',
    },}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef();

    // Closes on outside click.
    useEffect(() => {
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
        <div className={styles.optionWrapper} ref={dropdownRef}>
            <p className={styles.dropdownLabel} htmlFor="optionDropdown">{labels.label}</p>
            <div className={styles.dropdown} id="optionDropdown">
                <button type="button" className={`${styles.dropdownButton} ${hasError ? styles.dropdownBtnError : ''}`}
                        onClick={() => setIsOpen(!isOpen)}>
                    {selectedOption ? selectedOption.name : labels.optionName}
                </button>
                {isOpen && (
                    <div className={styles.dropdownContent}>
                        <input type="text" className={styles.searchBox} placeholder={labels.placeholder}
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
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
        </div>
    );
}

export default SearchDropdown;
