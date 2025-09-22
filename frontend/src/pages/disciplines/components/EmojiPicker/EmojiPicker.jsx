import ArrowRight from '@/assets/icons/arrowRight';
import styles from './EmojiPicker.module.css'

import EmojiModal from './EmojiModal/EmojiModal';

import { useState } from 'react';


export default function EmojiPicker({ value, onChange, isEditing=true, selectedEmoji, setSelectedEmoji }) {
    const [isEmojiModalOpen, setEmojiModalOpen] = useState(false);

    return (
        <div className={"inputContainer"}>
            <button className={`formInput ${!isEditing ? "readOnly" : ""}`} readOnly={!isEditing}
                type="button" onClick={() => setEmojiModalOpen(true)}>
                {value !== selectedEmoji ? (<>
                        {value || '🛇'} <ArrowRight className={styles.iconArrow}/> {selectedEmoji || '🛇'}
                </>) : (
                    value || '🛇'
                )}
            </button>
            <p id="dobLabel" className="customLabel">Ícone</p>
            {isEmojiModalOpen && (
                <EmojiModal isOpen={isEmojiModalOpen} onClose={() => setEmojiModalOpen(false)}
                    onSelect={(emoji) => {
                        setEmojiModalOpen(false);
                        setSelectedEmoji(emoji);
                        onChange(emoji);
                    }}/>
            )}
        </div>
    )
}