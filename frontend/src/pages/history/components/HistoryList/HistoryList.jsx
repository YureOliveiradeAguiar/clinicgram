import styles from './HistoryList.module.css'

import HistoryCard from '../HistoryCard/HistoryCard.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton.jsx';

import React, { useEffect, useState } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function HistoryList() {
    const [history, setHistory] = useState([]);
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

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
                if (!response.ok) {
                    setStatusMessage({ message: "Erro ao carregar histórico", type: "error" });
                    throw new Error('Erro ao carregar histórico');
                }
                return response.json();
            })
            .then(data => {
                setHistory(data);
                console.log(data);
            })
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão", type: "error" });
            });
    }, [historyRefreshKey]);

    const handleHistoryClear = async () => {
        try {
            const response = await fetch(`/api/history/clear/`, {
                method: "POST",
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setStatusMessage({ message: "Histórico limpo com sucesso", type: "success" });
                setHistoryRefreshKey(k => k + 1);
            } else {
                setStatusMessage({message: "Erro ao limpar histórico: " + (data.detail || "desconhecido"), type: "error"});
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão", type: "error" });
        }
    };

    const handleRollback = async (version_id) => {
        if (!window.confirm("Deseja realmente reverter para este ponto?")) return;
        try {
            const response = await fetch(`/api/history/rollback/${version_id}/`, {
                method: "POST",
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setStatusMessage({ message: "Reversão realizada com sucesso", type: "success" });
                setHistoryRefreshKey(k => k + 1);
            } else {
                setStatusMessage({message: "Erro ao reverter: " + (data.detail || "desconhecido"), type: "error"});
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão", type: "error" });
        }
    };

    return (
        <div className={styles.historyWrapper}>
            <div className={styles.formHeader}>
                <h2>Histórico</h2>
            </div>
            <button onClick={handleHistoryClear}>Limpar</button>
            <section className={styles.historyList}>
                {history.length > 0 ? (
                    history.map(record => (
                        <HistoryCard key={record.id} record={record} handleRollback={handleRollback}/>
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