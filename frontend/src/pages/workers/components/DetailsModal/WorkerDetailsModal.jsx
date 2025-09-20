import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import { formatPhone } from "@/utils/phoneUtils";

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function WorkerDetailsModal({ worker, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        password: "",
        whatsapp: worker.whatsapp || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, worker);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: worker.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
    }

    return (
        <DetailsModal title={isEditing ? "Edição do Estagiário" : "Detalhes do Estagiário"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="firstName" name="firstName" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.firstName}
                        className={`formInput ${!isEditing ? "readOnly": errors.firstName ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("firstName",(e.target.value))}/>
                    <label htmlFor="firstName">Nome*</label>
                    <p className="errorMessage">{errors.firstName || ""}</p>
                </div>
                <div className="inputContainer">
                    <input type="text" id="lastName" name="lastName" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.lastName}
                        className={`formInput ${!isEditing ? "readOnly": errors.lastName ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("lastName",(e.target.value))}/>
                    <label htmlFor="lastName">Sobrenome*</label>
                    <p className="errorMessage">{errors.lastName || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="email" name="email" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.email}
                        className={`formInput ${!isEditing ? "readOnly": errors.email ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("email",(e.target.value))}/>
                    <label htmlFor="email">Email*</label>
                    <p className="errorMessage">{errors.email || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="password" id="password" name="password" autoComplete="new-password" maxLength={128} placeholder="" 
                        value={fields.password} className={`formInput ${!isEditing ? "readOnly" : errors.password ? "formInputError" : ""}`}
                        readOnly={!isEditing} onChange={(e) => setField("password", e.target.value)}
                    />
                    <label htmlFor="password">Nova Senha</label>
                    <p className="errorMessage">{errors.password || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" " readOnly={!isEditing}
                        className={`formInput ${!isEditing ? "readOnly": errors.whatsapp ? "formInputError" : ""}`} value={fields.whatsapp}
                        onChange={(e) => {setField("whatsapp", formatPhone(e.target.value));}}/>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <p className="errorMessage">{errors.whatsapp || ""}</p>
                </div>
            </div>
        </DetailsModal>
    );
}