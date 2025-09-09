
import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import RegisterModal from '@/components/RegisterModal/RegisterModal';
import ElementDropdown from '../ElementDropdown/ElementDropdown';
import DatePicker from '../DatePicker/DatePicker';

import { getCookie } from '@/utils/csrf.js';


export default function AppointmentRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage, clients, workers, places, appointments}) {

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted  }, setError, clearErrors, control } = useForm({mode:'onBlur'});

 //========================================Dropdowns data=========================================   
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

//=========================================DatePicker data=========================================
    // Here is for checking date validity.
    const [hasDateError, setHasDateError] = useState(true);

//==================================================================================================
    const observationsValue = watch('observations') || '';
    
    const onSubmit = async (data) => {
        if (hasDateError) {
            setStatusMessage({message: "Data escolhida está ocupada!", type: "error" });
            return;
        }
        const payload = { ...data,
            startTime: data.timeRange?.startTime, 
            endTime: data.timeRange?.endTime,
        };
        delete payload.timeRange;
        try {
            const response = await fetch('/api/appointments/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')},
                credentials: 'include',
                body: JSON.stringify(payload)});

            const result = await response.json();
            if (response.ok) {
                setStatusMessage({message: result.message, type: "success"});
                reset();
                onSuccess(result.appointment);
            } else {
                setStatusMessage({ message: "Erro ao registrar o estagiário", type: "error" });
            }
        } catch (error) {
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error"});
        }
    };

    const handleError = () => {
        setStatusMessage({message: "Dados inválidos!", type: "error" });
    };

    return (
        <RegisterModal title="Nova consulta" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <Controller name="clientId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={clients} selectedOption={selectedClient}
                        onSelect={(option) => {field.onChange(option.id); setSelectedClient(option)}} hasError={errors.clientId}
                        labels={{ label: 'Paciente', placeholder: 'Pesquisar paciente...', noResults: 'Nenhum paciente registrado'}}
                    />
                )}
            />
            <Controller name="workerId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={workers} selectedOption={selectedWorker}
                        onSelect={(option) => {field.onChange(option.id); setSelectedWorker(option)}} hasError={errors.workerId}
                        labels={{ label: 'Estagiário', placeholder: 'Pesquisar estagiário...', noResults: 'Nenhum estagiário registrado'}}
                    />
                )}
            />
            <Controller name="placeId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={places} selectedOption={selectedPlace}
                        onSelect={(option) => {field.onChange(option.id); setSelectedPlace(option)}} hasError={errors.placeId}
                        labels={{ label: 'Sala', placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}
                    />
                )}
            />
            <div className="inputContainer">
                <input type="number" id="priority" name="priority" autoComplete="off"
                    maxLength="70" placeholder=" "
                    className={`formInput ${errors.priority ? "formInputError" : ""}`}
                    {...register('priority')}
                />
                <label htmlFor="priority">Prioridade</label>
                <p className="errorMessage">{errors.priority?.message || ""}</p>
            </div>

            <Controller name="timeRange" control={control}
                render={({ field }) => (
                    <DatePicker
                        onSelect={(start, end) => {field.onChange({ startTime: start, endTime: end });}}
                        appointments={appointments} selectedClient={selectedClient} selectedWorker={selectedWorker} selectedPlace={selectedPlace}
                        setHasDateError={setHasDateError}
                    />
                )}
            />

            <div className="inputContainer">
                <textarea  id="observations" name="observations" autoComplete="off"
                    maxLength="200" placeholder=" " className={"formInput formTexarea"}
                    {...register('observations')}/>
                <label htmlFor="observations">Observações</label>
                <span className='textareaCounter'>{observationsValue.length}/200</span>
            </div>
        </RegisterModal>
    );
}