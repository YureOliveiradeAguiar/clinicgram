import EmojiModal from '../EmojiModal/EmojiModal';
import styles from './EmojiPicker.module.css';

export default function EmojiPicker({ fieldLabel = "Ícone", }) {

    return (
        <div className={styles.emojiPickerWrapper}>
            <p id="dobLabel" className="fieldLabel">{fieldLabel}</p>
            <button type="button" className={styles.emojiPickerButton}
                onClick={() => setIsCreateEmojiModalOpen(true)}>
                {selectedCreateEmoji || '🛇'}
            </button>
            <input type="hidden" {...register('icon')} value={selectedCreateEmoji || ''} />
            {isCreateEmojiModalOpen && (
                <EmojiModal onClose={() => setIsCreateEmojiModalOpen(false)}
                    onSelect={(emoji) => {
                        setSelectedCreateEmoji(emoji);
                        setValue('icon', emoji);
                    }} />
            )}
        </div>
    )
}