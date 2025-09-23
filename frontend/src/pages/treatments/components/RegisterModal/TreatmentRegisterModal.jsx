import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import ElementDropdown from '@/components/ElementDropdown/ElementDropdown';

import { getCookie } from '@/utils/csrf.js';


export default function TreatmentRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage, disciplines, rooms }) {

    const { register, handleSubmit, reset, formState: { errors  }, control } = useForm({mode:'onBlur',});

//============================================Dropdown data============================================  
    const [selectedDiscipline, setSelectedDiscipline] = useState(null);
    const [selectedRooms, setSelectedRooms] = useState([]);

//===========================================Submiting logic===========================================
    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/treatments/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')},
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setStatusMessage({message: result.message, type: "success"});
                reset();
                onSuccess(result.treatment);
            } else {
                setStatusMessage({ message: "Erro ao registrar a sala", type: "error" });
            }
        } catch (error) {
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error"});
        }
    };
    const handleError = () => {
        setStatusMessage({message: "Dados inválidos!", type: "error" });
    };
//============================================================================================================

    return (
        <RegisterModal title="Novo Procedimento" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className='inputContainer'>
                <input type='text' id='name' name='name' autoComplete='off'
                    maxLength='70' placeholder=""
                    className={`formInput ${errors.name ? "formInputError" : ""}`}
                    {...register('name', { required: "O nome é obrigatório" })}
                />
                <label htmlFor='name'>Nome</label>
                <p className='errorMessage'>{errors.name?.message || ""}</p>
            </div>

            <Controller name='disciplineId' control={control} rules={{ required: "A disciplina é obrigatória" }}
                render={({ field }) => (
                    <ElementDropdown options={disciplines} selectedOption={selectedDiscipline}
                        onSelect={(option) => {field.onChange(option.id); setSelectedDiscipline(option)}} hasError={errors.disciplineId}
                        labels={{ label: 'Disciplina', placeholder: 'Pesquisar disciplina', noResults: 'Nenhuma disciplina encontrada'}}
                    />
                )}
            />

            <Controller name="rooms" control={control} rules={{ required: "Selecione pelo menos uma sala" }}
                render={({ field }) => (
                    <ElementDropdown options={rooms} selectedOptions={selectedRooms} isMultiSelect={true}
                        onSelect={(options) => {
                            field.onChange(options);
                            setSelectedRooms(options);
                        }}
                        hasError={errors.rooms}
                        labels={{ label: 'Sala', placeholder: 'Pesquisar sala', noResults: 'Nenhuma sala encontrada'}}
                    />
                )}
            />
        </RegisterModal>
    );
}