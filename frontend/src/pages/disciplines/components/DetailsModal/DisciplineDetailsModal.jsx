import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import usePatchFields from '@/hooks/usePatchFields';


export default function DisciplineDetailsModal({ discipline, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        name: discipline.name,
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, discipline);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: discipline.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Disciplina" : "Detalhes da Disciplina"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" disciplineholder=" " value={fields.name}
                        className={`formInput ${!isEditing ? "readOnly": errors.name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("name",(e.target.value))}/>
                    <label htmlFor="name">Nome</label>
                    <p className="errorMessage">{errors.name || ""}</p>
                </div>
            </div>
        </DetailsModal>
    );
}