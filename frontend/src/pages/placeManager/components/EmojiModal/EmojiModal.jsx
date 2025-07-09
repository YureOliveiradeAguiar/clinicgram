import { useRef, useEffect } from 'react';
import styles from './EmojiModal.module.css';

const emojiList = ['🏥', '👨‍⚕️', '🎸', '📚', '💼', '🏫', '🧪', '🎤', '🎮', '📅', '🧑‍💼', '💻', '🔬', '🧘‍♂️'];

export default function EmojiModal({ onSelect, onClose }) {
    const modalRef = useRef();

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
                <h3>Selecione um ícone</h3>
                <div className={styles.emojiGrid}>
                    {emojiList.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => {
                                onSelect(emoji);
                                onClose();
                            }}
                            className={styles.emojiButton}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
}