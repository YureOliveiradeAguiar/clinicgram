import { useRef, useEffect } from 'react';
import styles from './PhoneInput.module.css';


export default function PhoneInput({ phone, setPhone, onChange, isEditing=true, errors }) {
    // Expects in the parent: const [phone, setPhone] = useState({ country: '', area: '', number: '' });
//=====================================These Refs to control focus between inputs===================================
    const areaRef = useRef(null);
    const numberRef = useRef(null);

//=======================Calls the parent's onChange whenever a part of the phone number changes====================
    useEffect(() => {
        // Only call onChange if at least one field has a value
        if (phone.country || phone.area || phone.number) {
            const formattedCountryCode = phone.country.replace(/\D/g, '')
            const fullNumber = `${formattedCountryCode} ${phone.area} ${phone.number}`;
            onChange(fullNumber);
        }
    }, [phone]);

//===================================Sanitize of inputs and auto-focus handling======================================
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

//=========================================Auto adds the "+" in country code========================================
    const formatCountryCode = (eventObject) => {
        const value = eventObject.target.value;
        const cleaned = value.replace(/\D/g, '');
        let formatted = value;
        if (cleaned.length >= 1) {
            formatted = `+${cleaned}`;
        } else {
            formatted = cleaned;
        }
        return {
            ...eventObject, // This clones the rest of the event object
            target: {
                ...eventObject.target,
                value: formatted
            }
        };
    };
//================================================================================================================

    return (
        <div>
            <p className='fieldLabel'>Whatsapp</p>
            <div className={`${styles.container} ${errors && 'formInputError'}`}>
                <input type="tel" name="country" placeholder="+CC"
                    className={`${styles.input} ${styles.country} ${!isEditing ? "readOnly" : errors ? "formInputError" : ""}`}
                    maxLength={4} value={phone.country} onChange={(e) => handleInputChange('country', formatCountryCode(e))}
                />
                <input ref={areaRef} type="tel" name="area" placeholder="AAA"
                    className={`${styles.input} ${styles.area} ${!isEditing ? "readOnly" : errors ? "formInputError" : ""}`}
                    maxLength={3} value={phone.area} onChange={(e) => handleInputChange('area', e)}
                />
                <input ref={numberRef} type="tel" name="number" placeholder="NNNNNNN"
                    className={`${styles.input} ${styles.number} ${!isEditing ? "readOnly" : errors ? "formInputError" : ""}`}
                    maxLength={9} value={phone.number} onChange={(e) => handleInputChange('number', e)}
                />
            </div>
            <p className="errorMessage">{errors || ""}</p>
        </div>
    );
}