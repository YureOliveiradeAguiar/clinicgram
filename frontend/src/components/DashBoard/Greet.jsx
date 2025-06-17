import LogoImg from '../../assets/images/Logo.png'

import { useState, useEffect } from "react"

function Greet () {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) return;

        fetch('/api/profile/', {
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
        .then(res => {
            if (!res.ok) throw new Error('Falha ao carregar usuário');
            return res.json();
        })
        .then(data => setUser(data))
        .catch(err => console.error(err));
    }, [token]);

    if (!user) return <p>Carregando...</p>;

    const styles = {
        hero: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '15px',
        },
        logo: {
            height: '100px',
            width: '100px',
        }
    };

    return (
        <section style={styles.hero}>
            <img src={LogoImg} height="100" alt="Clinic" style={styles.logo}/>
            <h1> Sua Dashboard</h1>
            <p id="statusMessage">Bem-vindo, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!</p>
        </section>
    )
}

export default Greet