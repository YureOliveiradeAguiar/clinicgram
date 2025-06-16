import HeroImg from '../assets/Hero.png'
import styles from './Hero.module.css'

function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <h2>Agende sua consulta</h2>
                <p>Marque suas visitas à clínica de forma rápida e simples com nosso sistema de agendamento online.</p>
                <a href="{% url 'login' %}" className={styles.apointmentButton}>Fazer Agendamento</a>
            </div>
            <img src={HeroImg} alt="Doutora realizando consulta com o Clinicgram"/>
        </section>
    )
}

export default Hero