export default function XIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M45 45L30 30M30 30L15 15M30 30L45 15M30 30L15 45"
                    stroke={fill} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}