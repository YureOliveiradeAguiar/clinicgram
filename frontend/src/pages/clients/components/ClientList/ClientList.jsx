import AppointsIcon from '@/assets/icons/appointsIcon';
import CalendarIcon from '@/assets/icons/calendarIcon';
import UserAddIcon from '@/assets/icons/userAddIcon';
import styles from './ClientList.module.css'

import Navbar from '@/components/Navbar/Navbar.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';
import ClientCard from '../ClientCard/ClientCard.jsx';

import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function ClientList() {
    const navItems = [
        { to: '/schedule/new', Icon: AppointsIcon, label: "Agendamento" },
        { to: '/schedule', Icon: CalendarIcon, label: "Agenda" },
        { to: '/clients/new', Icon: UserAddIcon, label: "Novo Cliente" },
    ];
    
    const [clients, setClients] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    const navigate = useNavigate();

    const [openCardId, setOpenCardId] = useState(null);

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
    const handleDelete = async (clientId) => {
        if (!window.confirm('Tem certeza que deseja excluir esse cliente?')) return;

        try {
            const res = await fetch(`/api/clients/delete/${clientId}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });

            if (res.ok) {
                setClients(prev => prev.filter(c => c.id !== clientId));
            } else {
                setStatusMessage('Erro ao excluir cliente.');
            }
        } catch {
            setStatusMessage('Erro de conexão ao excluir cliente.');
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
                        <ClientCard key={client.id} client={client} onDelete={handleDelete}
                            isOpen={openCardId === client.id} setOpenCardId={setOpenCardId}/>
                ))
                ) : (
                    <p className="statusMessage">{statusMessage || 'Nenhum cliente registrado.'}</p>
                )}
            </section>

            <ReturnButton containerClass={styles.returnButtonContainer}/>
        </div>
    );
}

export default ClientList