import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import EmojiPicker from '../EmojiPicker/EmojiPicker';

import { getCookie } from '@/utils/csrf.js';


export default function PlaceRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, reset, formState: { errors  }, control } = useForm({mode:'onBlur',
        defaultValues: {
            icon: null,
        }
    });

    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const onSubmit = async (data) => {
        const payload = { ...data };
        try {
            const response = await fetch('/api/places/new/', {
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
                onSuccess(result.place);
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

    return (
        <RegisterModal title="Novo Paciente" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className="inputContainer">
                <input type="text" id="name" name="name" autoComplete="off"
                    maxLength="70" placeholder=" "
                    className={`formInput ${errors.name ? "formInputError" : ""}`}
                    {...register('name', { required: "O nome é obrigatório" })}
                />
                <label htmlFor="name">Nome Completo</label>
                <p className="errorMessage">{errors.name?.message || ""}</p>
            </div>

            <Controller name="icon" control={control}
                render={({ field }) => (
                    <EmojiPicker value={field.value} onChange={field.onChange} selectedEmoji={selectedEmoji} setSelectedEmoji={setSelectedEmoji}/>
                )}
            />

        </RegisterModal>
    );
}