import RegisterModal from '@/components/RegisterModal/RegisterModal';

import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { formatPhone, normalizePhone } from '@/utils/phoneUtils';


export default function WorkerRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted }, setError } = useForm({ mode: 'onBlur' });

    const whatsappValue = watch('whatsapp');

//===========================================Submiting logic=============================================
    const onSubmit = async (data) => {
        const rawPhone = normalizePhone(data.whatsapp);
        if (!rawPhone) {
            setError("whatsapp", { type: "manual", message: "WhatsApp é obrigatório" });
        }

        //const payload = { ...data, rawPhone };
        console.log("payload: ", payload);
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
//===========================================================================================================

    return (
        <RegisterModal title="Novo Estagiário" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className="inputContainer">
                <input type="text" id="firstName" name="firstName" autoComplete="off"
                    maxLength="70" placeholder=""
                    className={`formInput ${errors.firstName ? "formInputError" : ""}`}
                    {...register('firstName', { required: "O nome é obrigatório" })}/>
                <label htmlFor="firstName">Nome*</label>
                <p className="errorMessage">{errors.firstName?.message || ""}</p>
            </div>
            <div className="inputContainer">
                <input type="text" id="lastName" name="lastName" autoComplete="off"
                    maxLength="70" placeholder=""
                    className={`formInput ${errors.lastName ? "formInputError" : ""}`}
                    {...register('lastName', { required: "O sobrenome é obrigatório" })}/>
                <label htmlFor="lastName">Sobrenome*</label>
                <p className="errorMessage">{errors.lastName?.message || ""}</p>
            </div>
            <div className="inputContainer">
                <input type="text" id="email" name="email" autoComplete="off" maxLength="254" placeholder=""
                    className={`formInput ${errors.email ? "formInputError" : ""}`}
                    {...register('email', { required: "O nome é obrigatório",
                        pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Insira um email válido"}})}
                />
                <label htmlFor="email">Email*</label>
                <p className="errorMessage">{errors.name?.message || ""}</p>
            </div>
            <div className="inputContainer">
                <input type="password" id="password" name="password" autoComplete="new-password"
                    maxLength={128} placeholder=" " className={`formInput ${errors.password ? "formInputError" : ""}`}
                    {...register("password", {
                        required: "A senha é obrigatória",
                        minLength: { value: 6, message: "A senha deve ter ao menos 6 caracteres" }
                    })}
                />
                <label htmlFor="password">Senha*</label>
                <p className="errorMessage">{errors.password?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="number" id="ra" name="ra" autoComplete="off"
                    maxLength="70" placeholder=" "
                    className={`formInput ${errors.ra ? "formInputError" : ""}`}
                    {...register('ra', { required: "O RA é obrigatório",
                        pattern: { value: /^[0-9]+$/, message: "O RA deve conter apenas números"}
                    })}/>
                <label htmlFor="ra">RA*</label>
                <p className="errorMessage">{errors.ra?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" "
                    className={`formInput ${errors.whatsapp ? "formInputError" : ""}`} value={whatsappValue || ""}
                    {...register('whatsapp', {required: "WhatsApp é obrigatório",
                        validate: (value) => {
                            const digits = value.replace(/\D/g, '');
                            if (digits.length < 10) return "Número incompleto";
                            return true;
                    }})}
                    onChange={(e) => {const formatted = formatPhone(e.target.value);
                        setValue('whatsapp', formatted, { shouldValidate: isSubmitted});}}
                />
                <label htmlFor="whatsapp">WhatsApp</label>
                <p className="errorMessage">{errors.whatsapp?.message || " "}</p>
            </div>
        </RegisterModal>
    );
}