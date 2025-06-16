import styles from './About.module.css'
import Carousel from '../Carousel/Carousel.jsx'

function About() {
    return (
        <section id="about" className={styles.aboutSection}>
            <div className={styles.aboutContent}>
                <h2>Sobre o Clinicgram</h2>
                <p>O Clinicgram é uma plataforma desenvolvida para a gestão eficiente de agendamentos de salas em clínicas universitárias,
                    proporcionando organização e praticidade para alunos e professores.</p>
            </div>
            <Carousel/>
        </section>
    )
}

export default About