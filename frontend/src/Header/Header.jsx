import LogoImg from '../assets/Logo.png'
import styles from './Header.module.css'

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerWrapper}>
                <div className={styles.brand}>
                    <img src={LogoImg} alt="Clinicgram"/>
                    <h1>Clinicgram</h1>
                </div>
                <nav>
                    <ul>
                        <li><a href="#">Vantagens</a></li>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header