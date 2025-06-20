import styles from './ClientList.module.css'

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function ClientList() {
    const [clients, setClients] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();

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
            <h2>Clientes</h2>
            <section className={styles.clientList}>
                {clients.length > 0 ? (
                    clients.map(client => (
                        <div key={client.id} className={styles.clientCard}>
                            <div className={styles.cardHeader}>
                                <h3>{client.name}</h3>
                                <div className={styles.cardButtonSection}>
                                    <button className={styles.scheduleButton}
                                        onClick={() => navigate('/scheduling')}>Agendar</button>
                                    <span className={styles.iconContainer} data-icon="downArrow"></span>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <p><strong>WhatsApp:</strong> {client.whatsapp}</p>
                                <p><strong>Data de Nascimento:</strong> {client.dateOfBirth}</p>
                                <button className={styles.removeButton}
                                    onClick={() => handleDelete(client.id)}>Excluir cliente</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="statusMessage">{statusMessage || 'Nenhum cliente registrado.'}</p>
                )}
            </section>

            <section className={styles.buttonSection}>
                <button className={styles.returnButton} onClick={() => navigate('/dashboard')}>Voltar</button>
            </section>
        </div>
    );
}

export default ClientList