import XIcon from '@/assets/icons/xIcon';
import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon.com';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';
import ArrowRight from '@/assets/icons/arrowRight';
import styles from './PlaceModal.module.css';

import ModalButton from '../ModalButton/ModalButton';
import EmojiModal from '../../EmojiModal/EmojiModal';

import { useRef, useState, useEffect } from 'react';

export default function DetailsModal({ closeOnClickOutside=true, place, onDelete, onClose, onUpdate, modalStatus}) {
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(place.name);

    const [isEditEmojiModalOpen, setIsEditEmojiModalOpen] = useState(false);
    const [selectedEditEmoji, setSelectedEditEmoji] = useState(place.icon);

    const handleSave = () => {
        const updatedFields = {};
        if (editedName !== place.name) {
            updatedFields.name = editedName;
        }
        if (selectedEditEmoji !== place.icon) {
            updatedFields.icon = selectedEditEmoji;
        }
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ ...place, ...updatedFields });
        }
        setIsEditing(false);
    };

    useEffect(() => { // For outside click = close handling.
        if (!closeOnClickOutside) return;
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickOutside, onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <h2>Detalhes do Recipiente</h2>
                <p className={styles.statusMessage}>{modalStatus}</p>
                <div className={styles.infoContent}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nome:</span>
                        {isEditing ? (
                            <>
                                <input type="text" value={editedName} className={styles.input}
                                    onChange={(e) => setEditedName(e.target.value)} />
                            </>
                        ) : (<>
                            <span>{place.name}</span>
                        </>)}
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Ícone:</span>
                        {isEditing ? (
                            <>
                                <button type="button" className={styles.emojiPickerButton}
                                        onClick={() => setIsEditEmojiModalOpen(true)}>
                                    {(selectedEditEmoji || '🛇') === (place.icon || '🛇') ? (
                                        <span className={styles.emojiPickerBtnLabel}>{selectedEditEmoji || '🛇'}</span>
                                    ) : (
                                        <span className={styles.emojiPickerBtnLabel}>
                                            {place.icon || '🛇'}
                                            <ArrowRight className={styles.icon} />
                                            {selectedEditEmoji || '🛇'}
                                        </span>
                                    )}
                                </button>
                            </>
                        ) : (<>
                            <span>{place.icon || "nenhum"}</span>
                        </>)}
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <ModalButton Icon={TrashCan} onClick={onDelete} variant="delete"/>
                    {!isEditing ? (
                        <ModalButton Icon={EditIcon} onClick={() => setIsEditing(true)} variant="edit"/> 
                    ) : (<div className={styles.editButtonsRow}>
                            <ModalButton Icon={SaveIcon} onClick={() => handleSave()} variant="save"/> 
                            <ModalButton Icon={CancelIcon} variant="default" onClick={() => {
                                setIsEditing(false);
                                setEditedName(place.name);
                                setSelectedEditEmoji(place.icon);}}/>
                        </div>)}
                </div>
                <ModalButton Icon={XIcon} variant="close" onClick={onClose}/>
            </div>
            {isEditEmojiModalOpen && (
                <EmojiModal onClose={() => setIsEditEmojiModalOpen(false)}
                    onSelect={(emoji) => {
                        setSelectedEditEmoji(emoji);
                        setIsEditEmojiModalOpen(false);}}/>
            )}
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