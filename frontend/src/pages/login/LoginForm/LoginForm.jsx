import LogoImg from '@/assets/images/Logo.png'
import styles from './LoginForm.module.css'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

function Login () {
    const { register, handleSubmit } = useForm();
    const [status, setStatus] = useState({ message: "Entre para continuar", type: "statusMessage" });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/login/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                const token = result.token;
                localStorage.setItem('authToken', token);
                navigate('/dashboard');
            } else {
                setStatus({message: "Usuário ou senha inválidos", type: "errorMessage" });
            }
        } catch (error) {
            setStatus({message: "Erro de conexão com o servidor", type: "errorMessage" });
        }
    };

    return (
        <section className={styles.loginWrapper}>
            <img src={LogoImg} alt="Clinicgram" className={styles.headerLogo}></img>
            <h2 id={styles.welcomeMessage}>Faça seu Login</h2>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                <p id={styles[status.type]}>{status.message}</p>

                <div className={styles.formGroup}>
                    <label htmlFor="username">Usuário</label>
                    <input type="text" id="username" name="username"
                        maxLength="80" placeholder="Digite aqui" className="formInput"
                        {...register("username", { required: "Usuário é obrigatório" })}/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" minlenght="8"
                        maxLength="32" placeholder="Digite sua senha" className="formInput"
                        {...register("password", {required: "Senha é obrigatória"})}/>
                </div>

                <input type="submit" name="login" value="Entrar" className={styles.loginButton}/>
            </form>

            <div className={styles.observation}>
                <p>Contate um professor se houver problemas.</p>
            </div>
        </section>
    )
}

export default Login