import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { formatPhone, normalizePhone } from '@/utils/phoneUtils';


export default function WorkerRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted }, setError, clearErrors, control } = useForm({ mode: 'onBlur' });

    const whatsappValue = watch('whatsapp');

    const onSubmit = async (data) => {
        const rawPhone = normalizePhone(data.whatsapp);

        if (!rawPhone) {
            setError("whatsapp", { type: "manual", message: "WhatsApp é obrigatório" });
        }

        const payload = { ...data, rawPhone };
        try {
            const response = await fetch('/api/workers/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                setStatusMessage({ message: result.message, type: "success" });
                reset();
                onSuccess(result.worker);
            } else {
                setStatusMessage({ message: "Erro ao registrar o estagiário", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    const handleError = () => {
        setStatusMessage({ message: "Dados inválidos!", type: "error" });
    };

    return (
        <RegisterModal title="Novo Estagiário" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className="inputContainer">
                <input type="text" id="first_name" name="first_name" autoComplete="off" maxLength="70" placeholder=" "
                    className={`formInput ${errors.first_name ? "formInputError" : ""}`}
                    {...register('first_name', { required: "O nome é obrigatório", pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
                        message: "O nome deve conter apenas letras" } 
                    })}/>
                <label htmlFor="first_name">Nome</label>
                <p className="errorMessage">{errors.first_name?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="text" id="last_name" name="last_name" autoComplete="off" maxLength="70" placeholder=" "
                    className={`formInput ${errors.last_name ? "formInputError" : ""}`}
                    {...register('last_name', { required: "O sobrenome é obrigatório", pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, message: "O sobrenome deve conter apenas letras" } })} />
                <label htmlFor="last_name">Sobrenome</label>
                <p className="errorMessage">{errors.last_name?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="number" id="username" name="username" autoComplete="off"
                    maxLength="70" placeholder=" "
                    className={`formInput ${errors.username ? "formInputError" : ""}`}
                    {...register('username', { required: "O RA é obrigatório",
                        pattern: { value: /^[0-9]+$/, message: "O RA deve conter apenas números"}
                    })}/>
                <label htmlFor="username">RA</label>
                <p className="errorMessage">{errors.username?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="password" id="password" name="password" autoComplete="off" placeholder=" "
                    className={`formInput ${errors.password ? "formInputError" : ""}`}
                    {...register("password", { required: "A senha é obrigatória",
                        minLength: { value: 6, message: "A senha deve ter pelo menos 6 caracteres"}
                    })}/>
                <label htmlFor="password">Senha</label>
                <p className="errorMessage">{errors.password?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" "
                    className={`formInput ${errors.whatsapp ? "formInputError" : ""}`} value={whatsappValue || ""}
                    {...register('whatsapp', { required: "WhatsApp é obrigatório",
                        validate: (value) => {
                            const digits = value.replace(/\D/g, '');
                            if (digits.length < 10) return "Número incompleto";
                            return true;
                    }})}
                    onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setValue('whatsapp', formatted, { shouldValidate: isSubmitted});
                    }}/>
                <label htmlFor="whatsapp">WhatsApp</label>
                <p className="errorMessage">{errors.whatsapp?.message || " "}</p>
            </div>
        </RegisterModal>
    );
}