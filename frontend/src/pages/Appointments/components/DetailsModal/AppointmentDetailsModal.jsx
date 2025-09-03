import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import ElementDropdown from '../ElementDropdown/ElementDropdown.jsx';

import useFields from '@/hooks/useFieldPatch.jsx';


export default function AppointmentDetailsModal({ appointment, onDelete, isOpen, onClose, onUpdate,
        setStatusMessage, clients, workers, places
    }) {
    const contextFields = {
        client: appointment.client,
        worker: appointment.worker,
        place: appointment.place,
        observation: appointment.observation || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = useFields(contextFields);

    const [selectedClient, setSelectedClient] = useState(appointment.client);
    const [selectedWorker, setSelectedWorker] = useState(appointment.worker);
    const [selectedPlace, setSelectedPlace] = useState(appointment.place);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, appointment);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: appointment.id, ...updatedFields });
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
                <ElementDropdown isEditing={isEditing} options={clients}
                    onSelect={(option) => {setField("client", option); setSelectedClient(option)}}
                    selectedOption={selectedClient} setSelectedOption={setSelectedClient} hasError={errors.client}
                    labels={{ label: 'Paciente', placeholder: 'Pesquisar paciente...', noResults: 'Nenhum paciente registrado'}}/>

                <ElementDropdown isEditing={isEditing} options={workers}
                    onSelect={(option) => {setField("worker", option); setSelectedWorker(option)}}
                    selectedOption={selectedWorker} setSelectedOption={setSelectedWorker} hasError={errors.client}
                    labels={{ label: 'Estagiário', placeholder: 'Pesquisar estagiário...', noResults: 'Nenhum estagiário registrado'}}/>

                <ElementDropdown isEditing={isEditing} options={places}
                    onSelect={(option) => {setField("place", option); setSelectedPlace(option)}}
                    selectedOption={selectedPlace} setSelectedOption={setSelectedPlace} hasError={errors.client}
                    labels={{ label: 'Sala', placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}/>

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