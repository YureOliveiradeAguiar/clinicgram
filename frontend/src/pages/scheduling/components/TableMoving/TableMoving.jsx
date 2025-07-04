import ArrowLeft from '@/assets/icons/arrowLeft.jsx'
import ArrowRight from '@/assets/icons/arrowRight.jsx'
import ArrowDown from '@/assets/icons/arrowDown.jsx';
import CalendarIcon from '@/assets/icons/calendarIcon.jsx';
import styles from "./TableMoving.module.css";

export default function TableMoving ({ startOffset={startOffset}, setStartOffset={setStartOffset} }) {

  return (
    <div className={styles.tableMovingContainer}>
      	<div className={styles.weekConfigs}>
			<button type="button" className={styles.todayButton}
					onClick={() => setStartOffset(prev => prev = 0)}>Hoje</button>
        	<button type="button" className={styles.moveButton}
					onClick={() => setStartOffset(prev => prev - 7)}>
        	  	{ArrowLeft && <ArrowLeft className={styles.icon} />}
        	</button>
        	<button type="button" className={styles.moveButton}
					onClick={() => setStartOffset(prev => prev + 7)}>
        	  	{ArrowRight && <ArrowRight className={styles.icon} />}
        	</button>
      	</div>

      	<div type="button" className={styles.dateGroup}>
			<div className={styles.dateElement}>
				{ArrowDown && <ArrowDown className={styles.icon} />}
				30
			</div>
			<div className={styles.dateElement}>
				{ArrowDown && <ArrowDown className={styles.icon} />}
				dezembro
			</div>
			<div className={styles.dateElement}>
				{ArrowDown && <ArrowDown className={styles.icon} />}
				2025
			</div>
      	</div>
    </div>
  );
}