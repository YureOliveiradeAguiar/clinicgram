import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import ElementDropdown from '../ElementDropdown/ElementDropdown.jsx';

import useFields from '@/hooks/useFieldPatch.jsx';


export default function QueueDetailsModal({ pendingAppointment, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        client: pendingAppointment.client,
        worker: pendingAppointment.worker,
        place: pendingAppointment.place,
        observation: pendingAppointment.observation || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = useFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, pendingAppointment);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: pendingAppointment.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Consulta" : "Detalhes da Consulta"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <ElementDropdown isEditing={isEditing}/>
                <div className="inputContainer">
                    <textarea id="observations" name="observations" autoComplete="off" readOnly={!isEditing}
                        maxLength="200" placeholder=" " className={`formInput formTexarea ${!isEditing ? "readOnly" : ""}`}
                        onChange={(e) => setField("observation", e.target.value)} value={fields.observation} />
                    <label htmlFor="observations">Observações</label>
                    <span className={`textareaCounter ${!isEditing ? "readOnly" : ""}`}>{fields.observation.length}/200</span>
                </div>
            </div>
        </DetailsModal>
    );
}

/*
options = [], selectedOption, onSelect, hasError, labels = {
        label: 'Cliente', optionName : 'Selecione um cliente',
        placeholder: 'Pesquisar cliente...', noResults: 'Nenhum cliente registrado',

<EmojiPicker value={place.icon} isEditing={isEditing} selectedEmoji={selectedEmoji} setSelectedEmoji={setSelectedEmoji}
                onChange={(emoji) => setField("icon", emoji)}/>
*/