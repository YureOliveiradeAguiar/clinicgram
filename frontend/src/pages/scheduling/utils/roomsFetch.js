import { getCookie } from '@/utils/csrf.js';

export async function roomsFetch() {
    try {
        const res = await fetch('/api/rooms/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Erro ao carregar salas');
        }

        return await res.json();
    } catch (error) {
        console.error('Erro de conexão com o servidor:', error);
        throw error;
    }
}