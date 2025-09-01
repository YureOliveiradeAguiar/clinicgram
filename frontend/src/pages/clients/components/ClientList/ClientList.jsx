import AlertIcon from '@/assets/icons/alertSign';
import PersonAddIcon from '@/assets/icons/personAddIcon';
import styles from './ClientList.module.css'

import List from '@/components/List/List';
import Card from '@/components/Card/Card.jsx';
import ClientRegisterModal from '../ClientRegisterModal/ClientRegisterModal';
import ClientStatisticsModal from '../ClientStatisticsModal/ClientStatisticsModal';
import ClientDetailsModal from '../ClientDetailsModal/ClientDetailsModal.jsx';

import React, { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function ClientList() {

    const [clients, setClients] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [searchTerm, setSearchTerm] = useState("");

    const [openModal, setOpenModal] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleClientAdded = (newClient) => {
        setClients((prev) => [...prev, newClient]);
        setIsRegisterModalOpen(false);
    };

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
                    ...(patchData.observation !== undefined && { observation: patchData.observation }),
                }),
            });
            if (res.ok) {
                const updatedClient = await res.json();
                setClients(prev =>
                    prev.map(client => client.id === updatedClient.id ? updatedClient : client)
                );
                setSelectedClient(updatedClient);
                setStatusMessage({ message:"Paciente atualizado com sucesso!", type: "success" });
            } else {
                setStatusMessage({ message: "Erro ao atualizar", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro na comunicação com o servidor", type: "error" });
        }
    };

    return (
        <List title="Pacientes"
                NewElementIcon={PersonAddIcon} NewElementMessage="Novo" onNewElement={() => setOpenModal("register")}
                searchPlaceholder="Pesquisar paciente" searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
            {clients.length > 0 ? (
                clients
                    .filter((client) =>
                        client.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(client => (
                        <Card key={client.id} element={client} setOpenModal={setOpenModal}
                                selectedElement={selectedClient} setSelectedElement={setSelectedClient}>
                            <p className={styles.cardName} aria-label={client.name}>
                                {client.name}
                            </p>
                        </Card>
                ))
            ) : (
                <p>{statusMessage?.message || 'Nenhum cliente registrado'}</p>
            )}

            {openModal === "register" && (
                <ClientRegisterModal isOpen={openModal === "register"} onSuccess={handleClientAdded}
                        setStatusMessage={setStatusMessage} onClose={() => setOpenModal(false)} />
            )}
            {(openModal === "statistics" && selectedClient) && (
                <ClientStatisticsModal client={selectedClient} isOpen={selectedClient !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedClient(null); setOpenModal(null)}} onDelete={handleDeleteClient} onUpdate={handleUpdate}/>
            )}
            {(openModal === "properties" && selectedClient) && (
                <ClientDetailsModal client={selectedClient} isOpen={selectedClient !== null} setStatusMessage={setStatusMessage}
                        onClose={() => {setSelectedClient(null); setOpenModal(null)}} onDelete={handleDeleteClient} onUpdate={handleUpdate}/>
            )}
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </List>
    );
}