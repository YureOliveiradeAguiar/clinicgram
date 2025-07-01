import CheckIcon from '@/assets/icons/checkMark.jsx'
import BackIcon from '@/assets/icons/arrowLeft.jsx'
import styles from "./ConfirmBackButtons.module.css";

import { useNavigate } from "react-router-dom";

const ConfirmBackButtons = ({ containerClass, onBackPath = "/dashboard" }) => {
    const navigate = useNavigate();

    return (
        <div className={containerClass}>
            <button type="submit" name="registrar" className={`${styles.formButton} ${styles.confirmBtn}`}>
                {CheckIcon && <CheckIcon className={styles.icon} aria-hidden="true" />}
                Registrar
            </button>
            <button type="button" onClick={() => navigate(onBackPath)} className={`${styles.formButton} ${styles.returnBtn}`}>
                {BackIcon && <BackIcon className={styles.icon} aria-hidden="true" />}
                Voltar
            </button>
        </div>
    );
};

export default ConfirmBackButtons;