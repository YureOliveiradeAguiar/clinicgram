
import { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from "react-hook-form";

import RegisterModal from '@/components/RegisterModal/RegisterModal';
import ElementDropdown from '../../../../components/ElementDropdown/ElementDropdown';
import DatePicker from '../../../../components/DatePicker/DatePicker';

import { getCookie } from '@/utils/csrf.js';


export default function AppointmentRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage, treatments, clients, workers, places, appointments}) {

    const { register, handleSubmit, watch, reset, formState: { errors  }, control } = useForm({mode:'onBlur'});

 //========================================Dropdowns data==========================================  
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

//=======================================Interpreter of Selected Date Info===============================================
    /* Selected hours and day come from the table as values that change of time */
    const [selectedStartHours, setSelectedStartHours] = useState(null);
    const [selectedEndHours, setSelectedEndHours] = useState(null);
    const [selectedDay, setSelectedDay] = useState(() => null);

//=========================================DatePicker data=========================================
    // Here is for checking date validity.
    const [hasDateError, setHasDateError] = useState(true);

//=======================================Checking for best worker==================================
    const sortedWorkers = useMemo(() => {
        if (!workers || workers.length === 0) return [];
        if (!selectedTreatment) return workers;
        /* Preprocess stats for performance (appointments in last 30 days = less data processed) */
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        /* Here it creates the custom dictionary for sorting workers */
        const stats = {}; // 9 : {totalCount : 5 treatmentCount : 5} -> (9 is the client.id)
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.startTime);
            if (appointmentDate <= thirtyDaysAgo) return;
            const id = appointment.workerId;
            if (!stats[id]) {
                stats[id] = { treatmentCount: 0, totalCount: 0 };
            }
            stats[id].totalCount += 1;
            if (appointment.treatmentId === selectedTreatment.id) stats[id].treatmentCount += 1;
        });
        /* Sorts workers based on stats */
        const ordered = [...workers].sort((a, b) => {
            const aStat = stats[a.id] || { treatmentCount: 0, totalCount: 0 };
            const bStat = stats[b.id] || { treatmentCount: 0, totalCount: 0 };

            if (aStat.treatmentCount !== bStat.treatmentCount) {
                return aStat.treatmentCount - bStat.treatmentCount;
            }
            return aStat.totalCount - bStat.totalCount;
        });
        /* Gets the top worker stats and mark its equals */
        const topStat = stats[ordered[0].id] || { treatmentCount: 0, totalCount: 0 };
        return ordered.map(worker => {
            const workerStat = stats[worker.id] || { treatmentCount: 0, totalCount: 0 };
            return {
                ...worker,
                isTop:
                    workerStat.treatmentCount === topStat.treatmentCount &&
                    workerStat.totalCount === topStat.totalCount,
            };
        });
        
    }, [workers, appointments, selectedTreatment]);

//=================================================================================================
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
                setStatusMessage({ message: "Erro ao registrar consulta", type: "error" });
            }
        } catch (error) {
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error"});
        }
    };

    const handleError = () => {
        setStatusMessage({message: "Dados inválidos!", type: "error" });
    };

    return (
        <RegisterModal title="Nova Consulta" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <Controller name="treatmentId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={treatments} selectedOption={selectedTreatment}
                        onSelect={(option) => {field.onChange(option.id); setSelectedTreatment(option)}} hasError={errors.treatmentId}
                        labels={{ label: 'Procedimento', placeholder: 'Pesquisar procedimento...', noResults: 'Nenhum procedimento encontrado'}}
                    />
                )}
            />
            <Controller name="clientId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={clients} selectedOption={selectedClient}
                        onSelect={(option) => {field.onChange(option.id); setSelectedClient(option)}} hasError={errors.clientId}
                        labels={{ label: 'Paciente', placeholder: 'Pesquisar paciente...', noResults: 'Nenhum paciente encontrado'}}
                    />
                )}
            />
            <Controller name="workerId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={sortedWorkers} selectedOption={selectedWorker} bestOptions={sortedWorkers.filter(w => w.isTop)} 
                        onSelect={(option) => {field.onChange(option.id); setSelectedWorker(option)}} hasError={errors.workerId}
                        labels={{ label: 'Estagiário', placeholder: 'Pesquisar estagiário...', noResults: 'Nenhum estagiário encontrado'}}
                    />
                )}
            />
            <Controller name="placeId" control={control}
                render={({ field }) => (
                    <ElementDropdown options={places} selectedOption={selectedPlace}
                        onSelect={(option) => {field.onChange(option.id); setSelectedPlace(option)}} hasError={errors.placeId}
                        labels={{ label: 'Sala', placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala encontrada'}}
                    />
                )}
            />
            <div className="inputContainer">
                <input type="number" id="priority" name="priority" autoComplete="off"
                    maxLength="70" placeholder=" "
                    className={`formInput ${errors.priority ? "formInputError" : ""}`}
                    {...register('priority', { value: 0 })}
                />
                <label htmlFor="priority">Prioridade</label>
                <p className="errorMessage">{errors.priority?.message || ""}</p>
            </div>

            <Controller name="timeRange" control={control}
                render={({ field }) => (
                    <DatePicker
                        selectedStartHours={selectedStartHours} setSelectedStartHours={setSelectedStartHours} selectedEndHours={selectedEndHours}
                        setSelectedEndHours={setSelectedEndHours} selectedDay={selectedDay} setSelectedDay={setSelectedDay}

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