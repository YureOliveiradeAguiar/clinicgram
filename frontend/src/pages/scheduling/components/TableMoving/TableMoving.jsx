import ArrowLeft from '@/assets/icons/arrowLeft.jsx'
import ArrowRight from '@/assets/icons/arrowRight.jsx'
import styles from "./TableMoving.module.css";

export default function TableMoving ({
		startOffset={startOffset}, setStartOffset={setStartOffset},
		monthName={monthName}, year={year}}) {

	const adjustOffsetByMonth = (direction) => {
	  	const base = new Date();
	  	base.setDate(base.getDate() + startOffset); // go to current offset
	  	base.setMonth(base.getMonth() + direction); // add/remove a month

	  	const today = new Date();
	  	const newOffset = Math.floor((base - today) / (1000 * 60 * 60 * 24));
	  	setStartOffset(newOffset);
	};

	const adjustOffsetByYear = (direction) => {
	  	const base = new Date();
	  	base.setDate(base.getDate() + startOffset);
	  	base.setFullYear(base.getFullYear() + direction);

	  	const today = new Date();
	  	const newOffset = Math.floor((base - today) / (1000 * 60 * 60 * 24));
	  	setStartOffset(newOffset);
	};

  return (
    <div className={styles.tableMovingContainer}>
      	<div className={styles.weekConfigs}>
			<button type="button" className={styles.todayButton}
					onClick={() => setStartOffset(prev => prev = 0)}>Hoje</button>
        	<button type="button" className={styles.weekButton}
					onClick={() => setStartOffset(prev => prev - 7)}>
        	  	{ArrowLeft && <ArrowLeft className={styles.icon} />}
        	</button>
        	<button type="button" className={styles.weekButton}
					onClick={() => setStartOffset(prev => prev + 7)}>
        	  	{ArrowRight && <ArrowRight className={styles.icon} />}
        	</button>
      	</div>

      	<div type="button" className={styles.dateGroup}>
			<div className={styles.dateElement}>
				<button type="button" className={styles.moveButton}
						onClick={() => adjustOffsetByMonth(-1)}>
        		  	{ArrowLeft && <ArrowLeft className={styles.icon} />}
        		</button>
				<span className={styles.monthLabel}>{monthName}</span>
				<button type="button" className={styles.moveButton}
						onClick={() => adjustOffsetByMonth(1)}>
        		  	{ArrowRight && <ArrowRight className={styles.icon} />}
        		</button>
			</div>
			<div className={styles.dateElement}>
				<button type="button" className={styles.moveButton}
						onClick={() => adjustOffsetByYear(-1)}>
        		  	{ArrowLeft && <ArrowLeft className={styles.icon} />}
        		</button>
				<span className={styles.yearLabel}>{year}</span>
				<button type="button" className={styles.moveButton}
						onClick={() => adjustOffsetByYear(1)}>
        		  	{ArrowRight && <ArrowRight className={styles.icon} />}
        		</button>
			</div>
      	</div>
    </div>
  );
}