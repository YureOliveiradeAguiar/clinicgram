import DropdownArrow from "@/assets/icons/dropdownArrow"
import styles from "./NewElementButton.module.css"

import { forwardRef } from "react"


const NewElementButton = forwardRef(({ Icon, title, onClick, isDropdown, isDropdownOpen, newElementOptions }, ref) => {
    return (
        <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
            <button className={styles.newElementButton} onClick={onClick}>
                <Icon className={styles.icon} />
                <span className={styles.buttonTitle}>{title}{isDropdown && <DropdownArrow className={styles.icon} />}</span>
            </button>
            <div className={`${styles.newElementMenu} ${isDropdownOpen ? styles.open : styles.closed}`}>
                {newElementOptions?.map((option, index) => (
                    <button key={index} onClick={option.onClick}>
                        <span>{option.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});
export default NewElementButton;