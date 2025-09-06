import DetailsModal from '@/components/DetailsModal/DetailsModal';

import { useState } from 'react';

import { formatPhone } from "@/utils/phoneUtils";

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function WorkerDetailsModal({ worker, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        first_name: worker.first_name,
        last_name: worker.last_name,
        username: worker.username,
        password: worker.password,
        whatsapp: worker.whatsapp,
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
                    <input type="text" id="first_name" name="first_name" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.first_name}
                        className={`formInput ${!isEditing ? "readOnly": errors.first_name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("first_name",(e.target.value))}/>
                    <label htmlFor="first_name">Nome</label>
                    <p className="errorMessage">{errors.first_name || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="last_name" name="last_name" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.last_name}
                        className={`formInput ${!isEditing ? "readOnly": errors.last_name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("last_name",(e.target.value))}/>
                    <label htmlFor="last_name">Sobrenome</label>
                    <p className="errorMessage">{errors.last_name || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="number" id="username" name="username" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.username}
                        className={`formInput ${!isEditing ? "readOnly": errors.username ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("username",(e.target.value))}/>
                    <label htmlFor="username">RA</label>
                    <p className="errorMessage">{errors.username || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="password" name="password" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.password}
                        className={`formInput ${!isEditing ? "readOnly": errors.password ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("password",(e.target.value))}/>
                    <label htmlFor="password">Senha</label>
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