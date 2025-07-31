import styles from './HistoryList.module.css'

import HistoryItem from '../HistoryItem/HistoryItem';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

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

    return (
        <div className={styles.historyWrapper}>
            <div className={styles.formHeader}>
                <h2>Histórico</h2>
            </div>
            
            <section className={styles.historyList}>
                {history.length > 0 ? (
                    history.map(record => (
                        <HistoryItem key={`${record.model}-${record.id}-${record.history_date}`} record={record} />
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