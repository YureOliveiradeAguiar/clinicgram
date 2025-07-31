import CheckIcon from '@/assets/icons/checkMark';
import AlertIcon from '@/assets/icons/alertSign';
import AppointsIcon from '@/assets/icons/appointsIcon';
import CalendarIcon from '@/assets/icons/calendarIcon';
import UserAddIcon from '@/assets/icons/userAddIcon';
import styles from './PlaceForm.module.css'

import Navbar from '@/components/Navbar/Navbar.jsx';
import EmojiModal from '../EmojiModal/EmojiModal.jsx';
import PlaceCard from '../PlaceCard/PlaceCard.jsx';
import PlaceModal from '../PlaceModal/PlaceModal.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { placesFetch } from '@/utils/placesFetch.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function PlaceForm() {
    const navItems = [
        { to: '/schedule/new', Icon: AppointsIcon, label: "Agendamento" },
        { to: '/schedule', Icon: CalendarIcon, label: "Agenda" },
        { to: '/clients/new', Icon: UserAddIcon, label: "Novo Cliente" },
    ];

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({mode:'onBlur'});
    const [places, setPlaces] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [isCreateEmojiModalOpen, setIsCreateEmojiModalOpen] = useState(false);
    const [selectedCreateEmoji, setSelectedCreateEmoji] = useState('');

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalStatus, setModalStatus] = useState("");

    useEffect(() => {
        placesFetch() // Fetching for rendering places.
            .then(data => setPlaces(data))
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    const onSubmit = async (data) => {
    try {
        const response = await fetch('/api/places/new/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')},
            credentials: 'include',
            body: JSON.stringify(data)});

            if (!response.ok) {
                setStatusMessage({ message: "Erro ao registrar lugar", type: "error" });
                return;
            }
            placesFetch()
                .then(data => setPlaces(data))
                .catch(() => {
                    setStatusMessage({ message: "Erro ao atualizar lista de lugares", type: "error" });
            });
            setStatusMessage({ message: "Sala registrada com sucesso", type: "success" });
            resetForm();
        } catch (err) {
            setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    const resetForm = () => {
        reset(); // Reset from the react-hook-form.
        setSelectedCreateEmoji(null);
    };

    // Fetching for deleting a place.
    const handleDeletePlace = async () => { // Viewing.
        if (!selectedPlace) return;
        if (!window.confirm('Tem certeza que deseja excluir esse recipiente?')) return;
        try {
            const res = await fetch(`/api/places/delete/${selectedPlace.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setStatusMessage({ message: "Recipiente excluído com sucesso", type: "success" });
                setPlaces(prev => // Filters out the deleted place.
                    prev.filter(place => place.id !== selectedPlace.id)
                );
                setSelectedPlace(null); // Closes the modal.
            } else {
                setStatusMessage({ type: "error", message:<>
                    <AlertIcon className={styles.icon}/>
                    Erro ao excluir o recipiente</>});
            }
        } catch {
            setStatusMessage({ type: "error", message:<>
                    <AlertIcon className={styles.icon} />
                    Erro de conexão com o servidor</>});
        }
    };

    const handleUpdate = async (patchData) => {
        try {
            const res = await fetch(`/api/places/${patchData.id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(patchData.name !== undefined && { name: patchData.name }),
                    ...(patchData.icon !== undefined && { icon: patchData.icon }),
                }),
            });

            if (res.ok) {
                const updatedPlace = await res.json();
                setPlaces(prev =>
                    prev.map(place =>
                        place.id === updatedPlace.id ? updatedPlace : place
                    )
                );
                setSelectedPlace(updatedPlace);
                setModalStatus("Atualizado com sucesso!");
            } else {
                setModalStatus("Erro ao atualizar");
            }
        } catch (err) {
            console.error("Erro ao atualizar:", err);
            setModalStatus("Erro na comunicação com o servidor");
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Salas</h2>
                <Navbar items={navItems}/>
            </div>
            
            <form className={styles.placeForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.addPlaceGroup}>
                    <input type="text" id="name" name="name"  autoComplete="off"
                        maxLength="70" placeholder="Digite aqui"
                        className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
                        {...register('name', { required: "O nome é obrigatório" })}/>

                    <div className={styles.emojiPickerWrapper}>
                        <button type="button" className={styles.emojiPickerButton}
                                onClick={() => setIsCreateEmojiModalOpen(true)}>
                            {selectedCreateEmoji || '🛇'}
                        </button>
                        <input type="hidden" {...register('icon')} value={selectedCreateEmoji || ''} />
                    </div>

                    <button type="submit" className={styles.submitButton}>Registrar</button>
                </div>
                {isCreateEmojiModalOpen && (
                    <EmojiModal onClose={() => setIsCreateEmojiModalOpen(false)}
                        onSelect={(emoji) => {
                            setSelectedCreateEmoji(emoji);
                            setValue('icon', emoji);}}/>
                )}
            </form>
            <section className={styles.placesList}>
                {places.length > 0 ? (
                    places.map(place => (
                        <PlaceCard key={place.id} place={place}
                            modalStatus={modalStatus} setModalStatus={setModalStatus}
                            selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
                    ))
                ) : (
                    <p className="listMessage">Nenhuma sala registrada</p>
                )}
            </section>
            <ReturnButton containerClass={styles.returnButton}/>

            {selectedPlace && (
                <PlaceModal closeOnClickOutside={false} place={selectedPlace} onClose={() => setSelectedPlace(null)}
                        onDelete={handleDeletePlace} onUpdate={handleUpdate} modalStatus={modalStatus}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </div>
    );
}