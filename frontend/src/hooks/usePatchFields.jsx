import { useState } from "react";

import { validators } from '@/utils/validators.js';
import { normalizePhone } from "@/utils/phoneUtils.js";

export default function usePatchFields(contextFields = {}) {
    const [fields, setFields] = useState(contextFields);

    const [errors, setErrors] = useState(
        Object.keys(contextFields).reduce((accumulator, key) => ({ ...accumulator, [key]: "" }), {})
    );

    const setField = (key, value) => {
        setFields(prev => ({ ...prev, [key]: value }));
        // Runs a validation if a validator exists.
        if (validators[key]) {
            const error = validators[key](value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
        //console.log("fields: ", fields);
    };

    const validateAll = () => {
        let allValid = true;
        const newErrors = {};
        for (const key in fields) {
            if (validators[key]) {
                const error = validators[key](fields[key]);
                newErrors[key] = error;
                if (error) allValid = false;
            }
        }
        setErrors(newErrors);
        //console.log("allValid: ", allValid);
        return allValid;
    };

    const getUpdatedFields = (fields, element) => {
        const preprocess = (key, value) => { // This is per field, so add more pre-processing here if needed.
            if (key === "whatsapp") return normalizePhone(value);
            return value;
        };
        const updatedFields = {}; // Starts empty and gets field by the for loop of comparisons.
        for (const key in fields) {
            const editedValue = preprocess(key, fields[key]);
            const elementValue = preprocess(key, element[key]);
            if (editedValue !== elementValue) {
                updatedFields[key] = fields[key];
            }
            //console.log("editedValue: ", editedValue);
            //console.log("elementValue: ", elementValue);
        }
        return updatedFields;
    }

    const resetFields = () => {
        setFields(contextFields);
        setErrors(
            Object.keys(contextFields).reduce((accumulator, key) => ({ ...accumulator, [key]: "" }), {})
        );
    };

    return {fields, errors, setField, validateAll, getUpdatedFields, resetFields};
}