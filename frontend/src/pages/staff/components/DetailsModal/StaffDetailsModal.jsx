import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState, useEffect } from 'react';

import { formatPhone } from "@/utils/phoneUtils";

import useFields from '@/hooks/useFieldPatch.jsx';


export default function StaffDetailsModal({ staff, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        username: staff.username,
        whatsapp: staff.whatsapp,
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = useFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, staff);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: staff.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
    }

    return (
        <DetailsModal title={isEditing ? "Edição do Estagiário" : "Detalhes do Estagiário"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="username" name="username" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.username}
                        className={`formInput ${!isEditing ? "readOnly": errors.username ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("username",(e.target.value))}/>
                    <label htmlFor="username">Nome Completo</label>
                    <p className="errorMessage">{errors.username || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" " readOnly={!isEditing}
                        className={`formInput ${!isEditing ? "readOnly": errors.whatsapp ? "formInputError" : ""}`} value={fields.whatsapp}
                        onChange={(e) => {setField("whatsapp", formatPhone(e.target.value));}}/>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <p className="errorMessage">{errors.whatsapp || ""}</p>
                </div>
            </div>
        </DetailsModal>
    );
}