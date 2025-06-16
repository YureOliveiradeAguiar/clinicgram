import LogoImg from '../../assets/Logo.png'
import styles from './LoginForm.module.css'

function Login () {
    return (
        <section className={styles.loginWrapper}>
            <img src={LogoImg} alt="Clinicgram" className={styles.headerLogo}></img>
            <p id="welcomeMessage">Faça seu login</p>
            <form method="POST" id="loginForm">
                <p id="statusMessage">Entre para continuar</p>
                <div className={styles.formGroup}>
                    <label for="username">Usuário</label>
                    <input type="text" id="username" name="username" autocomplete="on"
                        maxlength="80" placeholder="Digite aqui" required/>
                </div>
                
                <div className={styles.formGroup}>
                    <label for="password">Senha</label>
                    <input type="password" id="password" name="password" minlenght="8"
                        maxlength="12" placeholder="Digite sua senha" required/>
                </div>

                <input type="submit" name="login" value="Entrar"/>
            </form>
            <div className={styles.observation}>
                <p>Contate um professor se houver problemas.</p>
            </div>
        </section>
    )
}

export default Login