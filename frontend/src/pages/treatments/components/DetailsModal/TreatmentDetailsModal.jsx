import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function TreatmentDetailsModal({ treatment, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        name: treatment.name,
        icon: treatment.icon,
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const [selectedEmoji, setSelectedEmoji] = useState(treatment.icon);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, treatment);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: treatment.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        setSelectedEmoji(treatment.icon);
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Sala" : "Detalhes da Sala"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" treatmentholder=" " value={fields.name}
                        className={`formInput ${!isEditing ? "readOnly": errors.name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("name",(e.target.value))}/>
                    <label htmlFor="name">Nome Completo</label>
                    <p className="errorMessage">{errors.name || ""}</p>
                </div>
            </div>
        </DetailsModal>
    );
}