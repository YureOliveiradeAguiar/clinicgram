import { getCookie } from '@/utils/csrf.js';

export async function appointmentsFetch() {
    try {
        const res = await fetch('/api/appointments/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error('Erro ao carregar agendamentos');
        }

        return await res.json();
    } catch (error) {
        console.error('Erro de conexão com o servidor:', error);
        throw error;
    }
}