import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import ElementDropdown from '@/components/ElementDropdown/ElementDropdown.jsx';
import DatePicker from '@/components/DatePicker/DatePicker.jsx';

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function AppointmentDetailsModal({ appointment, onDelete, isOpen, onClose, onUpdate,
        setStatusMessage, treatments, clients, workers, places, appointments
    }) {
    const contextFields = {
        treatmentId: appointment.treatmentId,
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

//=========================================Dropdowns data=========================================   
    const [selectedClient, setSelectedClient] = useState(appointment.client);
    const [selectedWorker, setSelectedWorker] = useState(appointment.worker);
    const [selectedPlace, setSelectedPlace] = useState(appointment.place);
    const [selectedTreatment, setSelectedTreatment] = useState(appointment.treatment);

//=======================================Interpreter of Selected Date Info===============================================
    const formatTime = (date) => {
        if (!date) return null;
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    };
    const appointmentStart = appointment?.startTime ? new Date(appointment.startTime) : null;
    const appointmentEnd = appointment?.endTime ? new Date(appointment.endTime) : null;
    /* Selected hours and day come from the table as values that change of time */
    const [selectedStartHours, setSelectedStartHours] = useState(formatTime(appointmentStart));
    const [selectedEndHours, setSelectedEndHours] = useState(formatTime(appointmentEnd));
    const [selectedDay, setSelectedDay] = useState(() => appointment?.startTime ? new Date(appointment.startTime).toISOString().split("T")[0] : null);

//=========================================DatePicker data=========================================
    // Here is for checking date validity.
    const [hasDateError, setHasDateError] = useState(true);

//==========================================Saving method==========================================
    const handleSave = async () => {
        if (hasDateError) {
            setStatusMessage({message: "Data escolhida está ocupada!", type: "error" });
            return;
        }
        const allValid = validateAll();
        if (!allValid) {
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

//==========================================Reseting method==========================================
    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        
        setSelectedClient(appointment.client);
        setSelectedWorker(appointment.worker);
        setSelectedPlace(appointment.place);
        setSelectedTreatment(appointment.treatment);

        setSelectedStartHours(formatTime(appointmentStart));
        setSelectedEndHours(formatTime(appointmentEnd));
        setSelectedDay(appointment?.startTime ? new Date(appointment.startTime).toISOString().split("T")[0] : null);
    }

//====================================================================================================

    return (
        <DetailsModal title={isEditing ? "Edição da Consulta" : "Detalhes da Consulta"} isOpen={isOpen}
            isEditing={isEditing} setIsEditing={setIsEditing}
            onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}
        >
            <ElementDropdown isEditing={isEditing} options={treatments}
                onSelect={(option) => {setField("treatmentId", option.id); setSelectedTreatment(option)}}
                selectedOption={selectedTreatment} hasError={errors.treatment}
                labels={{ label: 'Procedimento', placeholder: 'Pesquisar procedimento...', noResults: 'Nenhum procedimento registrado'}}
            />
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
                selectedOption={selectedPlace} hasError={errors.place}
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

            <DatePicker appointment={appointment} isEditing={isEditing}
                selectedStartHours={selectedStartHours} setSelectedStartHours={setSelectedStartHours} selectedEndHours={selectedEndHours}
                setSelectedEndHours={setSelectedEndHours} selectedDay={selectedDay} setSelectedDay={setSelectedDay}

                onSelect={(start, end) => {setField("startTime", start); setField("endTime", end);}}
                appointments={appointments} selectedClient={selectedClient} selectedWorker={selectedWorker} selectedPlace={selectedPlace}
                setHasDateError={setHasDateError}
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