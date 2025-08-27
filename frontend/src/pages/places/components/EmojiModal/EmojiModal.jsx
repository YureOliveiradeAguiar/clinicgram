import XIcon from '@/assets/icons/xIcon';
import styles from './EmojiModal.module.css';

import { useRef, useEffect } from 'react';

import ModalButton from '@/components/ModalButton/ModalButton.jsx';

export default function EmojiModal({ onSelect, onClose }) {
    const modalRef = useRef();

    const emojiList = ['🏥', '👨‍⚕️', '🦷', '🧠', '🐶', '🎸', '📚', '💼', '🏫', '🧪',
    '🎤', '🎮', '📅', '💻', '🔬', '🧘‍♂️', '⚖️', '📊', '🚒',
    '🍎', '🎨', '📸', '🧹', '🛠️', '🩺', '🥁', '📖'];

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
                        <button className={styles.emojiButton}
                            onClick={() => {
                                    onSelect(null);
                                    onClose();
                                }}>
                            🛇
                        </button>
                    {emojiList.map((emoji) => (
                        <button key={emoji} className={styles.emojiButton}
                                onClick={() => {
                                    onSelect(emoji);
                                    onClose();
                                }}>
                            {emoji}
                        </button>
                    ))}
                </div>
                <ModalButton Icon={XIcon} variant="close" onClick={() => onClose()}/>
            </div>
        </div>
    );
}