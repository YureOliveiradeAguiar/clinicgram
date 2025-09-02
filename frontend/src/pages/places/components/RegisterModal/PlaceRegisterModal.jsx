import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useForm } from "react-hook-form";

import EmojiPicker from '../EmojiPicker/EmojiPicker';

import { getCookie } from '@/utils/csrf.js';


export default function ClientRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitted  }, setError, clearErrors, control } = useForm({mode:'onBlur'});

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
                onSuccess(result.client);
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
                    {...register('name', { required: "O nome é obrigatório" })}/>
                <label htmlFor="name">Nome Completo</label>
                <p className="errorMessage">{errors.name?.message || ""}</p>
            </div>
            <EmojiPicker />
        </RegisterModal>
    );
}