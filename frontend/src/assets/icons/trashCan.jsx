export default function TrashCan ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M13 17H47L43.6423 48.1082C43.4032 50.3237 41.5838 52 39.4182 52H20.5817C18.4161 52 16.5969 50.3237 16.3577 48.1082L13 17Z"
                    fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.914 10.5811C20.6293 9.00541 22.1561 8 23.8336 8H36.1663C37.844 8 39.3706 9.00541 40.0861 10.5811L43 17H17L19.914 10.5811Z"
                    fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 17H51" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25 17V42" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 17V42" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}