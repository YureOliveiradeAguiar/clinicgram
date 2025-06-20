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
            <img src={LogoImg} alt="Clinicgram" className={styles.headerLogo}></img>
            <h2 className={`statusMessage ${status.type}`}>Faça seu Login</h2>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                <p id={[status.type]}>{status.message}</p>

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