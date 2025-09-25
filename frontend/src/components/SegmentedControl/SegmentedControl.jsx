import React, { useState, useEffect, useRef, createRef } from "react";
import styles from "./SegmentedControl.module.css";

export default function SegmentedControl({ options = [], value, onChange, disabled = false }) {
    const [thumbStyle, setThumbStyle] = useState({}); // This is the inline CSS width and transform. Very clever!
    // State to track the initial render
    const [isInitialRender, setIsInitialRender] = useState(true);
    // Creates an array of refs, one for each option
    const optionsRefs = useRef(options.map(() => createRef()));
    const containerRef = useRef(null);

//===================================Moves the track to fit the selected option==============================
    useEffect(() => {
        const activeOptionIndex = options.findIndex((option) => option.value === value);
        if (activeOptionIndex === -1) return;

        const activeOptionRef = optionsRefs.current[activeOptionIndex];

        if (activeOptionRef && activeOptionRef.current && containerRef.current) {
            const { offsetWidth, offsetLeft } = activeOptionRef.current;

            setThumbStyle({
                width: `${offsetWidth}px`,
                transform: `translateX(${offsetLeft}px)`,
            });
        if (isInitialRender) {
                setTimeout(() => setIsInitialRender(false), 0);
            }
        }
    }, [value, options, isInitialRender]); // Rerun when value or options change
//============================================================================================================

    return (
        <div>
            <div ref={containerRef} className={`${styles.segmentedControl} ${disabled ? styles.disabled : ""}`}>
                <div className={`${styles.thumb} ${isInitialRender ? styles.noTransition : ""}`} style={thumbStyle} />
                {options.map((option, index) => (
                    <button type="button" key={option.value} ref={optionsRefs.current[index]}
                        className={`${styles.segment} ${value === option.value ? styles.activeText : ""}`}
                        onClick={() => !disabled && onChange(option.value)} disabled={disabled}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <p className="blankMessage"/>
        </div>
    );
}