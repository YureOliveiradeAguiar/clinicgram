import styles from './Banner.module.css'

function Banner() {
    return (
        <section className={styles.banner}>
            <h2>Gestão Eficiente de Consultas e Registros Clínicos</h2>
            <p>Entre em contato e descubra como organizar seus e registros clínicos de forma simples e prática com nosso sistema especializado.</p>
            <a href="#contact" className={styles.bannerButton}>Fale Conosco</a>
        </section>
    )
}

export default Banner