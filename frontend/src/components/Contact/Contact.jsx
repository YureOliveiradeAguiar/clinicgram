import styles from './Contact.module.css'

function Contact () {
    return (
        <section id="contact" className={styles.contactSection}>
            <div>
                <h2>Entre em Contato</h2>
                <p>Estamos disponíveis para esclarecer dúvidas e oferecer suporte.</p>
                <ul>
                    <a href="mailto:contato@clinicabelvie.com" className={styles.contactButton}>suporte@clinicgram.com</a>
                    <li>Av. Secretário Divino Padrão, 1.411<br/>Santo Antonio, Sete Lagoas - MG, 35702-075</li>
                </ul>
            </div>
        
            <div>
                <h2>Horário de Atendimento</h2>
                <ul>
                    <li><strong>Segunda a Sexta:</strong> 08:00 - 18:00</li>
                    <li><strong>Sábado:</strong> 08:00 - 14:00</li>
                    <li>Para uma clínica livre de barreiras.</li>
                </ul>
            </div>
        </section>
    )
}

export default Contact