import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf';


export default function TreatmentRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, reset, formState: { errors  } } = useForm({mode:'onBlur',});

    const onSubmit = async (data) => {
        const payload = { ...data };
        try {
            const response = await fetch('/api/treatments/new/', {
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

    return (
        <RegisterModal title="Novo Procedimento" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className="inputContainer">
                <input type="text" id="name" name="name" autoComplete="off"
                    maxLength="70" treatmentholder=" "
                    className={`formInput ${errors.name ? "formInputError" : ""}`}
                    {...register('name', { required: "O nome é obrigatório" })}
                />
                <label htmlFor="name">Nome</label>
                <p className="errorMessage">{errors.name?.message || ""}</p>
            </div>
        </RegisterModal>
    );
}