import styles from './Advantages.module.css'

function Advantages () {
    return (
        <section id="advantages" className={styles.servicesSection}>
            <h2>Vantagens</h2>
            <div className={styles.servicesList}>
                <div className={styles.serviceItem}>
                    <h3>Disponibilidade em Tempo Real</h3>
                    <p>Visualize a disponibilidade das salas de atendimento e escolha o melhor horário para você.</p>
                </div>
                <div className={styles.serviceItem}>
                    <h3>Registro digital</h3>
                    <p>Tenha suas consultas e horários organizados e acessíveis de forma dinâmica e imediata.</p>
                </div>
                <div className={styles.serviceItem}>
                    <h3>Agendamento Rápido e Fácil</h3>
                    <p>Escolha o melhor horário para sua consulta e marque sua consulta em poucos cliques.</p>
                </div>
            </div>
        </section>
    )
}

export default Advantages