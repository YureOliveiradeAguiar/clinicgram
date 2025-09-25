import React, { useState, useRef, useEffect } from 'react';
import styles from './PhoneInput.module.css';

export default function PhoneInput({ onChange }) {
    const [phone, setPhone] = useState({
        country: '',
        area: '',
        number: '',
    });

    // Refs to control focus between inputs
    const areaRef = useRef(null);
    const numberRef = useRef(null);

    // This effect calls the parent's onChange whenever a part of the phone number changes
    useEffect(() => {
        // Only call onChange if at least one field has a value
        if (phone.country || phone.area || phone.number) {
            const fullNumber = `${phone.country} ${phone.area} ${phone.number}`;
            onChange(fullNumber.trim());
        }
    }, [phone, onChange]);

    const handleInputChange = (segment, e) => {
        const { value, maxLength } = e.target;

        // Allow only numbers (and '+' for country code)
        let sanitizedValue = segment === 'country' ? value.replace(/[^\d+]/g, '') : value.replace(/\D/g, '');

        setPhone((prev) => ({
            ...prev,
            [segment]: sanitizedValue,
        }));

        // Auto-focus to the next input when the current one is full
        if (sanitizedValue.length === maxLength) {
            if (segment === 'country') {
                areaRef.current?.focus();
            }
            if (segment === 'area') {
                numberRef.current?.focus();
            }
        }
    };

    return (
        <div className={styles.container}>
            <input
                type="tel"
                name="country"
                className={`${styles.input} ${styles.country}`}
                placeholder="+55"
                maxLength={3}
                value={phone.country}
                onChange={(e) => handleInputChange('country', e)}
            />
            <input
                ref={areaRef}
                type="tel"
                name="area"
                className={`${styles.input} ${styles.area}`}
                placeholder="31"
                maxLength={2}
                value={phone.area}
                onChange={(e) => handleInputChange('area', e)}
            />
            <input
                ref={numberRef}
                type="tel"
                name="number"
                className={`${styles.input} ${styles.number}`}
                placeholder="99999-9999"
                maxLength={9}
                value={phone.number}
                onChange={(e) => handleInputChange('number', e)}
            />
        </div>
    );
}