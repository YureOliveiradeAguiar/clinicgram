export default function PlusIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M10 30H50M30 10V50"
                fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}