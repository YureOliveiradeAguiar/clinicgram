import SearchIcon from '@/assets/icons/SearchIcon';
import PlusIcon from '@/assets/icons/plus';
import styles from './List.module.css';

import NewElementButton from '@/components/NewElementButton/NewElementButton.jsx';


export default function List({ children, title,
            NewElementIcon=PlusIcon, NewElementMessage, onNewElement,
            searchPlaceholder, searchTerm, setSearchTerm }) {
    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>{title}</h2>
                <div className={styles.searchContainer}>
                    <SearchIcon className={styles.searchIcon} />
                    <input type="text" placeholder={searchPlaceholder} value={searchTerm} className={styles.searchInput}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <NewElementButton Icon={NewElementIcon} title={NewElementMessage} onClick={onNewElement} />
            </div>
            {children}
        </div>
    );
}