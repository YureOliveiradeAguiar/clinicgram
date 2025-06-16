import styles from './Footer.module.css'

function Footer() {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} Clinicgram. Todos os direitos reservados.</p>
        </footer>
    )
}

export default Footer