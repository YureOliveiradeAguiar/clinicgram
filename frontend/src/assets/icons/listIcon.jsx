export default function ListIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M50 17H10" stroke={fill} fill="none" strokeWidth="3.75" strokeLinecap="round"/>
            <path d="M50 30L10 30" stroke={fill} fill="none" strokeWidth="3.75" strokeLinecap="round"/>
            <path d="M50 43L10 43" stroke={fill} fill="none" strokeWidth="3.75" strokeLinecap="round"/>
        </svg>
    )
}