import AppointsIcon from '@/assets/icons/appointsIcon';
import CalendarIcon from '@/assets/icons/calendarIcon';
import UserAddIcon from '@/assets/icons/userAddIcon';
import styles from './ClientList.module.css'

import Navbar from '@/components/Navbar/Navbar.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';
import ClientCard from '../ClientCard/ClientCard.jsx';
import ClientModal from '../ClientModal/ClientModal';

import React, { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';

function ClientList() {
    const navItems = [
        { to: '/schedule/new', Icon: AppointsIcon, label: "Agendamento" },
        { to: '/schedule', Icon: CalendarIcon, label: "Agenda" },
        { to: '/clients/new', Icon: UserAddIcon, label: "Novo Cliente" },
    ];
    
    const [clients, setClients] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    const [selectedClient, setSelectedClient] = useState(null);
    const [modalStatus, setModalStatus] = useState("");

    // Fetching for rendering clients card in the page.
    useEffect(() => {
        fetch('/api/clients/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar clientes');
            return res.json();
        })
        .then(data => {
            setClients(data);
        })
        .catch(() => {
            setStatus({message: "Erro de conexão com o servidor", type: "error" });
        });
    }, []);

    // Fetching for deleting a client.
    const handleDeleteClient = async () => { // Viewing.
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
                setStatus({ message: "Recipiente excluído com sucesso", type: "success" });
                setPlaces(prev => // Filters out the deleted place.
                    prev.filter(place => place.id !== selectedPlace.id)
                );
                setSelectedPlace(null); // Closes the modal.
            } else {
                setStatus({
                    type: "error", message: <>
                        <AlertIcon className={styles.icon} />
                        Erro ao excluir o recipiente</>
                });
            }
        } catch {
            setStatus({
                type: "error", message: <>
                    <AlertIcon className={styles.icon} />
                    Erro de conexão com o servidor</>
            });
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
        <div className={styles.clientsWrapper}>
            <div className={styles.formHeader}>
                <h2>Clientes</h2>
                <Navbar items={navItems}/>
            </div>
            <section className={styles.clientList}>
                {clients.length > 0 ? (
                    clients.map(client => (
                        <ClientCard key={client.id} client={client}
                                modalStatus={modalStatus} setModalStatus={setModalStatus}
                                selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
                    ))
                ) : (
                    <p className="statusMessage">{statusMessage || 'Nenhum cliente registrado.'}</p>
                )}
            </section>

            <ReturnButton containerClass={styles.returnButtonContainer}/>

            {selectedClient && (
                <ClientModal closeOnClickOutside={false} client={selectedClient} onClose={() => setSelectedClient(null)}
                        onDelete={handleDeleteClient} onUpdate={handleUpdate} modalStatus={modalStatus} />
            )}
        </div>
    );
}

export default ClientList