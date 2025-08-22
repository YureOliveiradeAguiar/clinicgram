export default function DoubleArrowLeft ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M47.5001 47.5L31.7678 31.7677C30.7916 30.7915 30.7916 29.2085 31.7678 28.2323L47.5001 12.5"
                stroke={fill} fill='none' strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M27.5001 47.5L11.7679 31.7677C10.7916 30.7915 10.7916 29.2085 11.7679 28.2323L27.5001 12.5"
                stroke={fill} fill='none' strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}