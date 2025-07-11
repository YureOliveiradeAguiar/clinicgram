import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ items }) {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                {items.map(({ to, Icon, label }, index) => (
                    <li className={styles.navItem} key={index} title={label}>
                        <Link to={to} className={styles.navLink}>
                            <Icon className={styles.navLinkIcon}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}