import LogoImg from '@/assets/images/Logo.png'
import styles from './LoginForm.module.css'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function Login () {
    const { register, handleSubmit } = useForm();
    const [status, setStatus] = useState({ message: "Entre para continuar", type: "info" });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/login/', {
            method: 'GET',
            credentials: 'include',
        });
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-CSRFToken': getCookie('csrftoken')},
                credentials: 'include',
                body: JSON.stringify(data)});

            const result = await response.json();
            if (response.ok) {
                navigate('/dashboard');
            } else {
                setStatus({message: result.error, type: "error" });
            }
        } catch (error) {
            setStatus({message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    return (
        <section className={styles.loginWrapper}>
            <div>
                <img src={LogoImg} alt="Clinicgram" className={styles.headerLogo}></img>
                <h2 id={styles.welcomeMessage}>Faça seu Login</h2>  
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                <p className={`loginStatusMessage ${status.type}`}>{status.message}</p>

                <div className="inputContainer">
                    <input type="text" id="username" name="username" autoComplete='true'
                        maxLength="80" placeholder=" " className="formInput"
                        {...register("username", { required: "Usuário é obrigatório" })}/>
                    <label htmlFor="username">Usuário</label>
                </div>

                <div className="inputContainer">
                    <input type="password" id="password" name="password" minlenght="8"
                        maxLength="32" placeholder=" " className="formInput"
                        {...register("password", {required: "Senha é obrigatória"})}/>
                    <label htmlFor="password">Senha</label>
                    <div className={styles.forgotPassword}>
                        <a href="/forgot-password">esqueceu a senha?</a>
                    </div>
                </div>
                
                <input type="submit" name="login" value="Login" className={styles.loginButton}/>

                <div className={styles.rememberMe}>
                    <label className={styles.rememberMeLabel}><input type="checkbox" name="remember" />Lembre-se de mim</label>
                </div>
            </form>

            <div className={styles.registration}>
                <p>Ainda não possui acesso?{" "}
                    <a href="/register" className={styles.registerLink}>
                        CADASTRE-SE
                    </a>
                </p>
            </div>
        </section>
    )
}

export default Login