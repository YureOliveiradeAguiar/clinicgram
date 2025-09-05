import XIcon from "@/assets/icons/xIcon";
import styles from "./Modal.module.css";

import ModalButton from "@/components/ModalButton/ModalButton.jsx";

import { useEffect } from "react";


export default function Modal({ title, isOpen, onClose, maxWidth='400px', children }) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{maxWidth:maxWidth}}>
                {title && (
                    <div className={styles.modalHeader}>
                        <h2>{title}</h2>
                    </div>
                )}
                {children}
                <ModalButton Icon={XIcon} variant="close" onClick={onClose} />
            </div>
        </div>
    );
}
