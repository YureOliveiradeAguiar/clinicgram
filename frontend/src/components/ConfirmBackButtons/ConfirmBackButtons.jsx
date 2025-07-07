import CheckIcon from '@/assets/icons/checkMark.jsx'
import styles from "./ConfirmBackButtons.module.css";
import ReturnButton from '@/components/ReturnButton/ReturnButton.jsx';

export default function ConfirmBackButtons ({ containerClass, onReturnPath }) {

    return (
        <div className={containerClass}>
            <button type="submit" name="registrar" className={`${styles.formButton} ${styles.confirmBtn}`}>
                {CheckIcon && <CheckIcon className={styles.icon} aria-hidden="true" />}
                Registrar
            </button>
            {ReturnButton && <ReturnButton onReturnPath={onReturnPath} />}
        </div>
    );
};