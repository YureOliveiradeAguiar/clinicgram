import ArrowLeft from '@/assets/icons/arrowLeft.jsx'
import ArrowRight from '@/assets/icons/arrowRight.jsx'
import MinusIcon from '@/assets/icons/minus.jsx'
import PlusIcon from '@/assets/icons/plus.jsx'
import styles from "./TableMoving.module.css";

export default function TimeSummary({ descriptionText, errorText, hasError }) {
    return (
        <div className={styles.tableMovingContainer}>
            <div className={styles.weeksButtons}>
                <button className={styles.moveButton}>
                    {ArrowLeft && <ArrowLeft className={styles.icon}/>}
                </button>
                <button className={styles.moveButton}>
                    {ArrowRight && <ArrowRight className={styles.icon}/>}
                </button>
            </div>

            <div className={`${styles.description} ${hasError ? styles.timeSumError : ''}`}>
                {hasError ? errorText : descriptionText}
            </div>
            
            <div className={styles.MonthDeets}>
                <button className={styles.moveButton}>
                    {MinusIcon && <MinusIcon className={styles.icon}/>} 1
                </button>
                <div className={styles.MonthName}>dezembro</div>
                <button className={styles.moveButton}>
                    {PlusIcon && <PlusIcon className={styles.icon}/>} 1
                </button>
            </div>
        </div>
    );
}
