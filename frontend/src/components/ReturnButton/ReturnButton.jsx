import BackIcon from '@/assets/icons/arrowLeft.jsx'
import styles from './ReturnButton.module.css'

import { useNavigate } from "react-router-dom";

export default function ({ onReturnPath = "/dashboard" }) {
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => navigate(onReturnPath)} className={`${styles.formButton} ${styles.returnBtn}`}>
            {BackIcon && <BackIcon className={styles.icon} aria-hidden="true" />}
            Voltar
        </button>
    );
}