import { useEffect } from 'react';

export function useAutoClearStatus(statusMessage, setStatusMessage, delay = 5000) {
    useEffect(() => {
        if (!statusMessage?.message) return;

        const timeout = setTimeout(() => {
            setStatusMessage(null);
        }, delay);

        return () => clearTimeout(timeout);
    }, [statusMessage, setStatusMessage, delay]);
}