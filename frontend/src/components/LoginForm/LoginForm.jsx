import LogoImg from '../../assets/Logo.png'
import styles from './LoginForm.module.css'

import { useState } from "react";
import { useForm } from "react-hook-form";

function Login () {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [statusMessage, setStatusMessage] = useState("Entre para continuar");

    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/login/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                setStatusMessage("Login bem-sucedido!");
            } else {
                setStatusMessage(result.detail || "Usuário ou senha inválidos");
            }
        } catch (error) {
            setStatusMessage("Erro de conexão com o servidor");
        }
    };

    return (
        <section className={styles.loginWrapper}>
            <img src={LogoImg} alt="Clinicgram" className={styles.headerLogo}></img>
            <h2 id={styles.welcomeMessage}>Faça seu Login</h2>

            <form onSubmit={handleSubmit(onSubmit)} id="loginForm">
                <p id={styles.statusMessage}>{statusMessage}</p>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Usuário</label>
                    <input type="text" id="username" name="username"
                        maxLength="80" placeholder="Digite aqui"
                        {...register("username", { required: "Usuário é obrigatório" })}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" minlenght="8"
                        maxLength="32" placeholder="Digite sua senha"
                        {...register("password", {required: "Senha é obrigatória"})}/>
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