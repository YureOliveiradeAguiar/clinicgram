import XIcon from '@/assets/icons/xIcon';
import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon.com';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';
import styles from './DetailsModal.module.css';

import ModalButton from '../ModalButton/ModalButton';

import { useRef, useState, useEffect } from 'react';

export default function DetailsModal({ place, onDelete, onClose, onUpdate, modalStatus }) {
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(place.name);

    const handleSave = () => {
        if (editedName !== place.name) {
            onUpdate({ ...place, name: editedName }); // Only if changed
        }
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
                <p className={styles.statusMessage}>{modalStatus}</p>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Nome:</span>
                    {isEditing ? (
                        <>
                            <input type="text" value={editedName} className={styles.input}
                                    onChange={(e) => setEditedName(e.target.value)}/>
                        </>
                    ) : (<>
                            <span>{place.name}</span>
                        </>)}
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Ícone:</span>
                    {isEditing ? (
                        <>
                            <input type="text" value={editedName} className={styles.input}
                                    onChange={(e) => setEditedName(e.target.value)}/>
                        </>
                    ) : (<>
                            <span>{place.icon || "nenhum"}</span>
                        </>)}
                </div>

                <div className={styles.buttonRow}>
                    <ModalButton Icon={TrashCan} onClick={onDelete} variant="delete"/>
                    {!isEditing ? (
                        <ModalButton Icon={EditIcon} onClick={() => setIsEditing(true)} variant="edit"/> 
                    ) : (<div className={styles.editButtonsRow}>
                            <ModalButton Icon={SaveIcon} onClick={() => handleSave()} variant="save"/> 
                            <ModalButton Icon={CancelIcon} onClick={() => {setIsEditing(false); setEditedName(place.name);}} variant="default"/> 
                        </div>)}
                </div>
                <ModalButton Icon={XIcon} onClick={onClose} variant="close"/>
            </div>
        </div>
    );
}
// <button onClick={handleSave}>💾</button>
// <button onClick={() => { setIsEditing(false);
//     setEditedName(place.name); // Resets on cancel.
// }}>✖️</button>



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