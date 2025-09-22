import styles from './EmojiModal.module.css';

import Modal from '@/components/Modal/Modal';


export default function EmojiModal({ isOpen, onSelect, onClose }) {

    const emojiList = ['🏥', '👨‍⚕️', '🦷', '🧠', '🐶', '🎸', '📚', '💼', '🏫', '🧪',
    '🎤', '🎮', '📅', '💻', '🔬', '🧘‍♂️', '⚖️', '📊', '🚒',
    '🍎', '🎨', '📸', '🧹', '🛠️', '🩺', '🥁', '📖'];

    return (
        <Modal title="Selecione um Ícone" isOpen={isOpen} onClose={onClose}>
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
        </Modal>
    );
}