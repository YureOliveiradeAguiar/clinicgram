import SaveIcon from '@/assets/icons/saveIcon';
import styles from './PlaceRegisterModal.module.css'

import Modal from '@/components/Modal/Modal';
import ModalButton from '@/components/ModalButton/ModalButton';
import EmojiModal from '../EmojiModal/EmojiModal.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';


export default function PlaceRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted  }, setError, clearErrors } = useForm({mode:'onBlur'});

    const [isCreateEmojiModalOpen, setIsCreateEmojiModalOpen] = useState(false);
    const [selectedCreateEmoji, setSelectedCreateEmoji] = useState('');

    const onSubmit = async (data) => {
    try {
        const response = await fetch('/api/places/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')},
            credentials: 'include',
            body: JSON.stringify(data)});

            const result = await response.json();
            if (response.ok) {
                setStatusMessage({ message: "Sala registrada com sucesso", type: "success" });
                resetForm();
                onSuccess(result.place);
            } else {
                setStatusMessage({ message: "Erro ao registrar sala", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            console.log(error)
        }
    };

    const resetForm = () => {
        reset(); // Reset from the react-hook-form.
        setSelectedCreateEmoji(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.formHeader}>
                <h2>Nova Sala</h2>
            </div>
            <form className={"inputContainer"} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.addPlaceGroup}>
                    <input type="text" id="name" name="name"  autoComplete="off"
                        maxLength="70" placeholder=" "
                        className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
                        {...register('name', { required: "O nome é obrigatório" })}/>
                    <label htmlFor="name">Nome da Sala</label>
                    <p className="errorMessage">{errors.name?.message || " "}</p>

                    <div className={styles.emojiPickerWrapper}>
                        <p id="dobLabel" className="fieldLabel">Ícone</p>
                        <button type="button" className={styles.emojiPickerButton}
                                onClick={() => setIsCreateEmojiModalOpen(true)}>
                            {selectedCreateEmoji || '🛇'}
                        </button>
                        <input type="hidden" {...register('icon')} value={selectedCreateEmoji || ''} />
                    </div>
        
                    <div className={styles.buttonSection}>
                        <ModalButton Icon={SaveIcon} variant="save" type="submit" name="registrar" buttonTitle="Registrar"/>
                    </div>
                </div>
                {isCreateEmojiModalOpen && (
                    <EmojiModal onClose={() => setIsCreateEmojiModalOpen(false)}
                        onSelect={(emoji) => {
                            setSelectedCreateEmoji(emoji);
                            setValue('icon', emoji);}}/>
                )}
            </form>
        </Modal>
    );
}