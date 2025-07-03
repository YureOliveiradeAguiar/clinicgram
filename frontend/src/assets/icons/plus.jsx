export default function PlusIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M15 30H45M30 15V45" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                fill="none" stroke={fill}/>
        </svg>
    )
}