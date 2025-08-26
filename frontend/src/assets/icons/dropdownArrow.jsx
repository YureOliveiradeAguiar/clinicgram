export default function DropdownArrow ({ width = 60, height = 60, fill = 'currentColor', className }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M31.7677 36.7678C30.7915 37.744 29.2085 37.744 28.2323 36.7678L15.7322 24.2678C14.7559 23.2915 14.7559 21.7086 15.7322 20.7322C16.7086 19.7559 18.2914 19.7559 19.2678 20.7322L30 31.4645L40.7323 20.7322C41.7085 19.7559 43.2915 19.7559 44.2677 20.7322C45.244 21.7086 45.244 23.2915 44.2677 24.2678L31.7677 36.7678Z"
            fill={fill} stroke="none"/>
        </svg>
    )
}
