export default function SidebarIcon ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M7 27.7778C7 19.3972 7 15.207 9.63603 12.6035C12.2721 10 16.5147 10 25 10H34C42.4852 10 46.728 10 49.3639 12.6035C52 15.207 52 19.3972 52 27.7778V32.2222C52 40.6027 52 44.7931 49.3639 47.3964C46.728 50 42.4852 50 34 50H25C16.5147 50 12.2721 50 9.63603 47.3964C7 44.7931 7 40.6027 7 32.2222V27.7778Z"
                stroke={fill} fill="none" strokeWidth="3.75"/>
            <path d="M23 50V10" stroke={fill} fill="none" strokeWidth="3.75" strokeLinecap="round"/>
        </svg>
    )
}