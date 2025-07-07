import styles from './PlaceForm.module.css'

import ReturnButton from '@/components/ReturnButton/ReturnButton.jsx';
import PlaceCard from '../PlaceCard/PlaceCard.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { placesFetch } from '@/utils/placesFetch.js';
import { getCookie } from '@/utils/csrf.js';

export default function PlaceForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({mode:'onBlur'});

    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [status, setStatus] = useState({ message: "Registre uma sala", type: "info" });

    const [listMessage, setListMessage] = useState('');
    const [openCardId, setOpenCardId] = useState(null);

    useEffect(() => {
        placesFetch() // Fetching for rendering places.
            .then(data => setPlaces(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
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
                setStatus({ message: "Erro ao registrar lugar", type: "error" });
                return;
            }
            placesFetch()
                .then(data => setPlaces(data))
                .catch(() => {
                    setStatus({ message: "Erro ao atualizar lista de lugares", type: "error" });
            });
            setStatus({ message: "Lugar registrado com sucesso", type: "success" });
            reset();
        } catch (err) {
            console.error('Erro na requisição:', err);
            setStatus({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    // Fetching for deleting a client.
    const handleDelete = async (placeId) => {
        if (!window.confirm('Tem certeza que deseja excluir esse sala?')) return;
        try {
            const res = await fetch(`/api/places/delete/${placeId}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setPlaces(prev => prev.filter(p => p.id !== placeId));
            } else {
                setStatus({ message: "Erro ao excluir sala", type: "error" });
            }
        } catch {
            setStatus({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <h2>Gerenciar Salas</h2>
            <p className={`statusMessage ${status.type}`}>{status.message}</p>
            <form className={styles.placeForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.addPlaceGroup}>
                    <input type="text" id="name" name="name"  autoComplete="off"
                        maxLength="70" placeholder="Digite aqui"
                        className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
                        {...register('name', { required: "O nome é obrigatório" })}/>
                    <button type="submit" className={styles.submitButton}>Registrar</button>
                </div>
            </form>
            <section className={styles.placesList}>
                {places.length > 0 ? (
                    places.map(place => (
                        <PlaceCard key={place.id} place={place} onDelete={handleDelete}
                            isOpen={openCardId === place.id} setOpenCardId={setOpenCardId}/>
                ))
                ) : (
                    <p className="listMessage">{listMessage || 'Nenhuma sala registrada.'}</p>
                )}
            </section>
            <ReturnButton containerClass={styles.returnButton}/>
        </div>
    );
}