import AlertIcon from '@/assets/icons/alertSign';
import UserAddIcon from '@/assets/icons/userAddIcon';
import styles from './ClientList.module.css'

import ReturnButton from '@/components/ReturnButton/ReturnButton';
import ClientCard from '../ClientCard/ClientCard.jsx';
import ClientModal from '../ClientDeetsModal/ClientDeetsModal';

import React, { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [selectedClient, setSelectedClient] = useState(null);
    const [modalStatus, setModalStatus] = useState(null);

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
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error" });
        });
    }, []);

    // Fetching for deleting a client.
    const handleDeleteClient = async () => { // Viewing.
        if (!selectedClient) return;
        if (!window.confirm('Tem certeza que deseja excluir esse cliente?')) return;
        try {
            const res = await fetch(`/api/clients/delete/${selectedClient.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setStatusMessage({ message: "Cliente excluído com sucesso", type: "success" });
                setClients(prev => // Filters out the deleted client.
                    prev.filter(client => client.id !== selectedClient.id)
                );
                setSelectedClient(null); // Closes the modal.
            } else {
                setStatusMessage({
                    type: "error", message: <>
                        <AlertIcon className={styles.icon} />
                        Erro ao excluir o cliente</>
                });
            }
        } catch {
            setStatusMessage({
                type: "error", message: <>
                    <AlertIcon className={styles.icon} />
                    Erro de conexão com o servidor</>
            });
        }
    };
    
    const handleUpdate = async (patchData) => {
        try {
            const res = await fetch(`/api/clients/${patchData.id}/`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(patchData.name !== undefined && { name: patchData.name }),
                    ...(patchData.whatsapp !== undefined && { whatsapp: patchData.whatsapp }),
                    ...(patchData.dateOfBirth !== undefined && { dateOfBirth: patchData.dateOfBirth }),
                }),
            });
            if (res.ok) {
                const updatedClient = await res.json();
                setClients(prev =>
                    prev.map(client => client.id === updatedClient.id ? updatedClient : client)
                );
                setSelectedClient(updatedClient);
                //console.log(patchData);
                setModalStatus({ message: "Atualizado com sucesso!", type: "success" });
            } else {
                setModalStatus({ message: "Erro ao atualizar", type: "error" });
            }
        } catch (err) {
            console.error("Erro ao atualizar:", err);
            setModalStatus({ message: "Erro na comunicação com o servidor", type: "error" });
        }
    };

    return (
        <div className={styles.clientsWrapper}>
            <div className={styles.formHeader}>
                <h2>Pacientes</h2>
                <button className={styles.newClientButton}>
                    {UserAddIcon && <UserAddIcon className={styles.icon} />}
                    <span>Novo</span>
                </button>
            </div>
            <section className={styles.clientList}>
                {clients.length > 0 ? (
                    clients.map(client => (
                        <ClientCard key={client.id} client={client}
                                modalStatus={modalStatus} setModalStatus={setModalStatus}
                                selectedClient={selectedClient} setSelectedClient={setSelectedClient} />
                    ))
                ) : (
                    <p>{statusMessage?.message || 'Nenhum cliente registrado'}</p>
                )}
            </section>

            <ReturnButton containerClass={styles.returnButtonContainer}/>

            {selectedClient && (
                <ClientModal closeOnClickOutside={false} client={selectedClient} onClose={() => setSelectedClient(null)}
                        onDelete={handleDeleteClient} onUpdate={handleUpdate} modalStatus={modalStatus} />
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </div>
    );
}