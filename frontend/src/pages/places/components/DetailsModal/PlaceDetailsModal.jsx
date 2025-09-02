import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import EmojiPicker from '../EmojiPicker/EmojiPicker';

import useFields from '@/hooks/useFieldPatch.jsx';


export default function PlaceDetailsModal({ place, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        name: place.name,
        icon: place.icon,
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = useFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const [selectedEmoji, setSelectedEmoji] = useState(place.icon);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, place);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: place.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        setSelectedEmoji(place.icon);
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Sala" : "Detalhes da Sala"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.name}
                        className={`formInput ${!isEditing ? "readOnly": errors.name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("name",(e.target.value))}/>
                    <label htmlFor="name">Nome Completo</label>
                    <p className="errorMessage">{errors.name || ""}</p>
                </div>
            </div>

            <EmojiPicker value={place.icon} isEditing={isEditing} selectedEmoji={selectedEmoji} setSelectedEmoji={setSelectedEmoji}
                onChange={(emoji) => setField("icon", emoji)}/>

        </DetailsModal>
    );
}