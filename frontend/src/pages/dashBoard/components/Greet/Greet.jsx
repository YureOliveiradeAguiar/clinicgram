import LogoImg from '@/assets/images/Logo.png'

import styles from './Greet.module.css'

import { useState, useEffect } from "react"

import { getCookie } from '@/utils/csrf.js';

function Greet () {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('/api/profile', {
            method: 'GET',
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar usuário');
            return res.json();
        })
        .then(data => {setUser(data);})
        .catch(err => {console.error('Erro ao buscar perfil do usuário:', err);});
    }, []);

    return (
        <section className={styles.hero}>
            <img src={LogoImg} height="100" alt="Clinic" className={styles.logo}/>
            <h1> Sua Dashboard</h1>
            {user ? (
                <p id="statusMessage">Bem-vindo, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</p>
            ) : (
                <p>Carregando usuário...</p>
            )}
            
        </section>
    )
}

export default Greet