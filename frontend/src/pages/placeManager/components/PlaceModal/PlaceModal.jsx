import styles from './PlaceModal.module.css';

import DeleteButton from '@/components/DeleteButton/DeleteButton';
import EditIcon from '@/assets/icons/editIcon.com';

import { useRef, useState, useEffect } from 'react';

export default function PlaceModal({ place, onDelete, onClose, onUpdate }) {
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(place.name);

    const handleSave = () => {
        onUpdate({ ...place, name: editedName }); // Sends updated place to parent.
        setIsEditing(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <h2>Detalhes do Recipiente</h2>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Nome:</span>
                    {isEditing ? (
                        <>
                            <input type="text" value={editedName} className={styles.input}
                                    onChange={(e) => setEditedName(e.target.value)}/>
                            <button onClick={handleSave}>💾</button>
                            <button onClick={() => { setIsEditing(false);
                                setEditedName(place.name); // Resets on cancel.
                            }}>✖️</button>
                        </>
                    ) : (
                        <>
                            <span>{place.name}</span>
                            <button onClick={() => setIsEditing(true)}>✏️</button>
                        </>
                    )}
                </div>

                <div className={styles.buttonRow}>
                    <DeleteButton onDelete={onDelete}/>
                    <button>
                        <EditIcon className={styles.icon}/>
                    </button>
                    <button className={styles.closeButton} onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}
//<div className={styles.cardBody}>
//        <div className={styles.infoRow}>
//            <span className={styles.label}>Nome:</span>
//            <span>{place.name}</span>
//        </div>
//        <div className={styles.infoRow}>
//            <span className={styles.label}>Disponibilidade:</span>
//            <div className={styles.weekOptions}>
//                {daysOfWeek.map((day) => (
//                    <label key={day.value} className={styles.dayToggle}>
//                        <input type="checkbox" value={day.value} />
//                        <span>{day.label}</span>
//                    </label>
//                ))}
//            </div>
//        </div>
//        <div className={styles.buttonRow}>
//            <DeleteButton onClick={() => onDelete(place.id)} />
//        </div>
//    </div>
//)}