import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import ElementDropdown from '@/components/ElementDropdown/ElementDropdown';

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function TreatmentDetailsModal({ treatment, onDelete, isOpen, onClose, onUpdate, 
        setStatusMessage, disciplines
    }) {
    const contextFields = {
        name: treatment.name,
        discipline: treatment.discipline,
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

//=========================================Dropdown data==========================================   
    const [selectedDiscipline, setSelectedDiscipline] = useState(treatment.discipline);

//==========================================Saving method==========================================
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

        setSelectedDiscipline(treatment.discipline);
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Disciplina" : "Detalhes da Disciplina"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" treatmentholder=" " value={fields.name}
                        className={`formInput ${!isEditing ? "readOnly": errors.name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("name",(e.target.value))}/>
                    <label htmlFor="name">Nome</label>
                    <p className="errorMessage">{errors.name || ""}</p>
                </div>

                <ElementDropdown isEditing={isEditing} options={disciplines}
                    onSelect={(option) => {setField("disciplineId", option.id); setSelectedDiscipline(option)}}
                    selectedOption={selectedDiscipline} hasError={errors.discipline}
                    labels={{ label: 'Disciplina', placeholder: 'Pesquisar disciplina', noResults: 'Nenhuma disciplina registrada'}}
                />
            </div>
        </DetailsModal>
    );
}