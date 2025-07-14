export default function InfoIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M30 27.5V40M30 52.5C17.5736 52.5 7.5 42.4265 7.5 30C7.5 17.5736 17.5736 7.5 30 7.5C42.4265 7.5 52.5 17.5736 52.5 30C52.5 42.4265 42.4265 52.5 30 52.5ZM30.1245 20V20.25L29.8755 20.2505V20H30.1245Z"
            stroke={fill} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}