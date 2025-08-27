import AlertIcon from '@/assets/icons/alertSign';
import styles from './PlaceList.module.css'

import NewElementButton from '@/components/NewElementButton/NewElementButton.jsx';
import PlusIcon from '@/assets/icons/plus';
import PlaceCard from '../PlaceCard/PlaceCard.jsx';
import PlaceRegisterModal from '../PlaceRegisterModal/PlaceRegisterModal';
import PlaceModal from '../PlaceModal/PlaceModal.jsx';

import { useState, useEffect } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { placesFetch } from '@/utils/placesFetch.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function PlaceList() {
    const [places, setPlaces] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalStatus, setModalStatus] = useState("");

    const handlePlaceAdded = (newPlace) => {
        setPlaces((prev) => [...prev, newPlace]);
        setIsRegisterModalOpen(false);
    };

    useEffect(() => {
        placesFetch() // Fetching for rendering places.
            .then(data => setPlaces(data))
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    // Fetching for deleting a place.
    const handleDeletePlace = async () => { // Viewing.
        if (!selectedPlace) return;
        if (!window.confirm('Tem certeza que deseja excluir essa sala?')) return;
        try {
            const res = await fetch(`/api/places/delete/${selectedPlace.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setStatusMessage({ message: "Sala excluída com sucesso", type: "success" });
                setPlaces(prev => // Filters out the deleted place.
                    prev.filter(place => place.id !== selectedPlace.id)
                );
                setSelectedPlace(null); // Closes the modal.
            } else {
                setStatusMessage({ type: "error", message:<>
                    <AlertIcon className={styles.icon}/>
                    Erro ao excluir a sala</>});
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
                <NewElementButton Icon={PlusIcon} title="Nova" onClick={() => setIsRegisterModalOpen(true)}/>
            </div>

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

            {isRegisterModalOpen && (
                <PlaceRegisterModal isOpen={isRegisterModalOpen} onSuccess={handlePlaceAdded}
                        statusMessage={statusMessage} setStatusMessage={setStatusMessage} onClose={() => setIsRegisterModalOpen(false)} />
            )}

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