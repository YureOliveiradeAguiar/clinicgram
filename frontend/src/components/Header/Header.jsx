import LogoImg from '../../assets/Logo.png'
import styles from './Header.module.css'

function Header(showNavbar) {
    return (
        <header className={styles.header}>
            <div className={styles.headerWrapper}>
                <div className={styles.brand}>
                    <img src={LogoImg} alt="Clinicgram"/>
                    <h1>Clinicgram</h1>
                </div>
                {showNavbar && (
                    <nav>
                        <ul>
                            <li><a href="#about">Sobre</a></li>
                            <li><a href="#advantages">Vantagens</a></li>
                            <li><a href="#contact">Contato</a></li>
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    )
}

export default Header