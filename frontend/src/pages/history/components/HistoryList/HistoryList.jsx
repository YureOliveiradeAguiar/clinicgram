import styles from './HistoryList.module.css'

import HistoryCard from '../HistoryCard/HistoryCard.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton.jsx';

import React, { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function HistoryList() {
    const [history, setHistory] = useState([]);

    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    useEffect(() => {
        fetch('/api/history/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar histórico');
                return response.json();
            })
            .then(data => {
                setHistory(data);
                console.log(data);
            })
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    const handleRollback = async (versionId) => {
        if (!window.confirm("Deseja realmente reverter para este ponto?")) return;

        try {
            const response = await fetch(`/api/history/rollback/${versionId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${yourAccessToken}`, // If using JWT or similar
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert("Rollback realizado com sucesso.");
                // Optionally refresh data here
            } else {
                alert("Erro ao reverter: " + (data.detail || "desconhecido."));
            }
        } catch (error) {
            alert("Erro de rede ao tentar reverter.");
        }
    };

    return (
        <div className={styles.historyWrapper}>
            <div className={styles.formHeader}>
                <h2>Histórico</h2>
            </div>
            
            <section className={styles.historyList}>
                {history.length > 0 ? (
                    history.map(record => (
                        <HistoryCard key={record.id} record={record}/>
                    ))
                ) : (
                    <p>Histórico vazio</p>
                )}
            </section>

            <ReturnButton containerClass={styles.returnButtonContainer}/>

            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </div>
    );
}