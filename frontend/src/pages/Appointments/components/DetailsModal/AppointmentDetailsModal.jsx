import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import ElementDropdown from '../ElementDropdown/ElementDropdown.jsx';
import DatePicker from '../DatePicker/DatePicker.jsx';

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function AppointmentDetailsModal({ appointment, onDelete, isOpen, onClose, onUpdate,
        setStatusMessage, clients, workers, places, appointments
    }) {
    const contextFields = {
        clientId: appointment.clientId,
        workerId: appointment.workerId,
        placeId: appointment.placeId,
        priority: appointment.priority,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        observation: appointment.observation || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);
 //========================================Dropdowns data=========================================   
    const [selectedClient, setSelectedClient] = useState(appointment.client);
    const [selectedWorker, setSelectedWorker] = useState(appointment.worker);
    const [selectedPlace, setSelectedPlace] = useState(appointment.place);
//=========================================DatePicker data=========================================
    const [selectedStartHours, setSelectedStartHours] = useState(null);
    const [selectedEndHours, setSelectedEndHours] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    // These two down here are for displaying selectedIndexes.
    const [selectedStartTime, setSelectedStartTime] = useState(appointment.startTime);
    const [selectedEndTime, setSelectedEndTime] = useState(appointment.endTime);
    // Here is for checking date validity.
    const [isDateValid, setIsDateValid] = useState(true);
//==================================================================================================

    const handleSave = async () => {
        console.log("isDateValid: ", isDateValid);
        const allValid = validateAll();
        if (!allValid || !isDateValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, appointment);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: appointment.id, ...updatedFields });
        }
        //console.log("updatedFields: ", updatedFields);
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        setSelectedClient(appointment.client);
        setSelectedWorker(appointment.worker);
        setSelectedPlace(appointment.place);

        setSelectedStartHours(null);
        setSelectedEndHours(null);
        setSelectedDay(null);
        setSelectedStartTime(appointment.startTime);
        setSelectedEndTime(appointment.endTime);
    }

    return (
        <DetailsModal title={isEditing ? "Edição da Consulta" : "Detalhes da Consulta"} isOpen={isOpen}
            isEditing={isEditing} setIsEditing={setIsEditing}
            onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}
        >
            <ElementDropdown isEditing={isEditing} options={clients}
                onSelect={(option) => {setField("clientId", option.id); setSelectedClient(option)}}
                selectedOption={selectedClient} hasError={errors.client}
                labels={{ label: 'Paciente', placeholder: 'Pesquisar paciente...', noResults: 'Nenhum paciente registrado'}}
                />
            <ElementDropdown isEditing={isEditing} options={workers}
                onSelect={(option) => {setField("workerId", option.id); setSelectedWorker(option)}}
                selectedOption={selectedWorker} hasError={errors.worker}
                labels={{ label: 'Estagiário', placeholder: 'Pesquisar estagiário...', noResults: 'Nenhum estagiário registrado'}}
                />
            <ElementDropdown isEditing={isEditing} options={places}
                onSelect={(option) => {setField("placeId", option.id); setSelectedPlace(option)}}
                selectedOption={selectedPlace} hasError={errors.client}
                labels={{ label: 'Sala', placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}
                />
            <div className="inputContainer">
                <input type="number" id="priority" name="priority" autoComplete="off"
                    min="0" max="99" placeholder=" " value={fields.priority}
                    className={`formInput ${!isEditing ? "readOnly": errors.priority ? "formInputError" : ""}`} readOnly={!isEditing}
                    onChange={ (e) => setField("priority", Number(e.target.value) )}
                />
                <label htmlFor="priority">Prioridade</label>
                <p className="errorMessage">{errors.priority || ""}</p>
            </div>

            <DatePicker appointment={appointment} isEditing={isEditing} onSelect={(start, end) => {setField("startTime", start); setField("endTime", end);}}
                startHours={selectedStartHours} setStartHours={setSelectedStartHours} endHours={selectedEndHours}
                setEndHours={setSelectedEndHours} scheduledDay={selectedDay} setScheduledDay={setSelectedDay}
                appointments={appointments} selectedClient={selectedClient} selectedWorker={selectedWorker} selectedPlace={selectedPlace}
                selectedStartTime={selectedStartTime} selectedEndTime={selectedEndTime} // Selected cells UI display
                setSelectedStartTime={setSelectedStartTime} setSelectedEndTime={setSelectedEndTime} // Selected cells UI display
                isDateValid={isDateValid} setIsDateValid={setIsDateValid} // Error handling
            />

            <div className="inputContainer">
                <textarea id="observations" name="observations" autoComplete="off" readOnly={!isEditing}
                    maxLength="200" placeholder=" " className={`formInput formTexarea ${!isEditing ? "readOnly" : ""}`}
                    onChange={(e) => setField("observation", e.target.value)} value={fields.observation} />
                <label htmlFor="observations">Observações</label>
                <span className={`textareaCounter ${!isEditing ? "readOnly" : ""}`}>{fields.observation.length}/200</span>
            </div>
        </DetailsModal>
    );
}