import RegisterModal from '@/components/RegisterModal/RegisterModal';
import DateInput from '../DateInput/DateInput';

import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { formatPhone, normalizePhone } from '@/utils/phoneUtils';


export default function ClientRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted  }, setError, clearErrors, control } = useForm({mode:'onBlur'});

    const whatsappValue = watch('whatsapp');
    
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);

    const observationsValue = watch('observations') || '';
    
//==================================================Submitting logic================================================
    const onSubmit = async (data) => {
        const rawPhone = normalizePhone(data.whatsapp);
        if (!rawPhone) {
            setError("whatsapp", {type: "manual", message: "WhatsApp é obrigatório"});
            return
        }
        data.whatsapp = rawPhone;
        try {
            const response = await fetch('/api/clients/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                setStatusMessage({ message: result.message, type: "success" });
                reset();
                onSuccess(result.client);
            } else {
                setStatusMessage({ message: "Erro ao registrar o cliente", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    const handleError = () => {
        setStatusMessage({ message: "Dados inválidos!", type: "error" });
    };
//=======================================================================================================================

    return (
        <RegisterModal title="Novo Paciente" onSubmit={handleSubmit(onSubmit, handleError)} isOpen={isOpen} onClose={onClose}>
            <div className="inputContainer">
                <input type="text" id="firstName" name="firstName" autoComplete="off"
                    maxLength="70" placeholder=""
                    className={`formInput ${errors.firstName ? "formInputError" : ""}`}
                    {...register('firstName', { required: "O nome é obrigatório" })}/>
                <label htmlFor="firstName">Nome</label>
                <p className="errorMessage">{errors.firstName?.message || ""}</p>
            </div>
            <div className="inputContainer">
                <input type="text" id="lastName" name="lastName" autoComplete="off"
                    maxLength="70" placeholder=""
                    className={`formInput ${errors.lastName ? "formInputError" : ""}`}
                    {...register('lastName', { required: "O sobrenome é obrigatório" })}/>
                <label htmlFor="lastName">Sobrenome</label>
                <p className="errorMessage">{errors.lastName?.message || ""}</p>
            </div>

            <div className="inputContainer">
                <input type="text" id="email" name="email" autoComplete="off" maxLength="254" placeholder=""
                    className={`formInput ${errors.email ? "formInputError" : ""}`}
                    {...register('email', { required: "O nome é obrigatório",
                        pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Insira um email válido"}})}
                />
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Senha</label>
                <p className="errorMessage">{errors.password?.message || ""}</p>
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
                    onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setValue('whatsapp', formatted, { shouldValidate: isSubmitted});
                    }}/>
                <label htmlFor="whatsapp">WhatsApp</label>
                <p className="errorMessage">{errors.whatsapp?.message || " "}</p>
            </div>

            <Controller name="dateOfBirth" control={control} rules={{ required: "Informe a data de nascimento completa" }}
                render={({ field, fieldState }) => (
                    <DateInput value={field.value} onDateChange={field.onChange} onBlur={field.onBlur}
                        hasError={fieldState.error} clearErrors={() => clearErrors("dateOfBirth")}
                        selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonthLabel={selectedMonthLabel}
                        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                        setSelectedMonthLabel={setSelectedMonthLabel} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
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