import ArrowLeft from '@/assets/icons/arrowLeft.jsx'
import ArrowRight from '@/assets/icons/arrowRight.jsx'
import styles from "./TableMoving.module.css";

export default function TableConfigs({ onDateChange }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekSegment = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Sunday as start

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Saturday as end

    return `${start.getDate()}-${end.getDate()}`;
  };

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const weekLabel = getWeekSegment(currentDate);
  const monthLabel = currentDate.toLocaleString("pt-BR", { month: "long" });

  return (
    <div className={styles.tableMovingContainer}>
        <div className={styles.weekConfigs}>
          <button className={styles.moveButton} onClick={() => handleWeekChange(-1)}>
            {ArrowLeft && <ArrowLeft className={styles.icon} />}
          </button>
          <div className={styles.timeLabel}>{weekLabel}</div>
          <button className={styles.moveButton} onClick={() => handleWeekChange(1)}>
            {ArrowRight && <ArrowRight className={styles.icon} />}
          </button>
        </div>
        <button className={styles.timeLabel}>Abrir calendário</button>
    </div>
  );
}