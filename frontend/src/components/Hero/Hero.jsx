import { useNavigate  } from 'react-router-dom';
import HeroImg from '../../assets/images/Hero.png'
import styles from './Hero.module.css'

function Hero() {
    const navigate = useNavigate();

    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <h2>Agende sua consulta</h2>
                <p>Marque suas visitas à clínica de forma rápida e simples com nosso sistema de agendamento online.</p>
                <button onClick={() => navigate('/login')} className={styles.apointmentButton}>Fazer Agendamento</button>
            </div>
            <img src={HeroImg} alt="Doutora realizando consulta com o Clinicgram"/>
        </section>
    )
}

export default Hero